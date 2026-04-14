import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
} from '../lib/productsService'
import { CreateProductInput, Product, UpdateProductInput } from '../types'

// Query keys
export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: () => [...productKeys.lists()] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
}

function newOptimisticId(): string {
    const c = globalThis.crypto
    return `__optimistic__${c?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`}`
}

function optimisticProduct(
    id: string,
    data: CreateProductInput,
    imageUrl?: string
): Product {
    const now = new Date()
    return {
        id,
        ...data,
        images: imageUrl ? [imageUrl] : (data.images || []),
        createdAt: now,
        updatedAt: now,
        createdBy: '__optimistic__',
    }
}

function applyProductPatch(product: Product, data: UpdateProductInput, now: Date): Product {
    return {
        ...product,
        ...data,
        updatedAt: now,
    }
}

// Get all products
export function useProducts() {
    return useQuery({
        queryKey: productKeys.list(),
        queryFn: getProducts,
    })
}

// Get single product
export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => getProductById(id),
        enabled: !!id,
    })
}

// Create product
export function useCreateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, imageFiles }: { data: CreateProductInput; imageFiles?: File[] }) =>
            createProduct(data, imageFiles),
        onMutate: async ({ data, imageFiles }) => {
            await queryClient.cancelQueries({ queryKey: productKeys.lists() })
            const previousList = queryClient.getQueryData<Product[]>(productKeys.list())
            const optimisticId = newOptimisticId()
            const next = optimisticProduct(
                optimisticId,
                data,
                data.images?.[0] // First image for preview
            )

            queryClient.setQueryData<Product[]>(productKeys.list(), (old) =>
                old ? [next, ...old] : [next]
            )

            return { previousList, optimisticId }
        },
        onError: (_err, _vars, context) => {
            if (context?.previousList !== undefined) {
                queryClient.setQueryData(productKeys.list(), context.previousList)
            }
        },
        onSuccess: async (newId, _vars, context) => {
            if (!context?.optimisticId) return
            const fresh = await getProductById(newId)
            if (!fresh) return
            queryClient.setQueryData<Product[]>(productKeys.list(), (old) => {
                if (!old) return [fresh]
                return old.map((p) =>
                    p.id === context.optimisticId ? fresh : p
                )
            })
            queryClient.setQueryData(productKeys.detail(newId), fresh)
        },
    })
}

// Update product
export function useUpdateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
            newImageFiles,
            removedPublicIds,
        }: {
            id: string
            data: UpdateProductInput
            newImageFiles?: File[]
            removedPublicIds?: string[]
        }) => updateProduct(id, data, { newImageFiles, removedPublicIds }),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: productKeys.lists() })
            await queryClient.cancelQueries({ queryKey: productKeys.detail(id) })

            const previousList = queryClient.getQueryData<Product[]>(productKeys.list())
            const previousDetail = queryClient.getQueryData<Product | null | undefined>(
                productKeys.detail(id)
            )

            const now = new Date()
            queryClient.setQueryData<Product[]>(productKeys.list(), (old) => {
                if (!old) return old
                return old.map((p) =>
                    p.id === id ? { ...p, ...data, updatedAt: now } : p
                )
            })
            queryClient.setQueryData<Product | null>(productKeys.detail(id), (old) => {
                if (!old) return old
                return { ...old, ...data, updatedAt: now }
            })

            return { previousList, previousDetail }
        },
        onError: (_err, variables, context) => {
            if (context?.previousList !== undefined) {
                queryClient.setQueryData(productKeys.list(), context.previousList)
            }
            if (context?.previousDetail !== undefined) {
                queryClient.setQueryData(
                    productKeys.detail(variables.id),
                    context.previousDetail
                )
            }
        },
        onSuccess: (_void, variables) => {
            if (variables.newImageFiles && variables.newImageFiles.length > 0) {
                void queryClient.invalidateQueries({
                    queryKey: productKeys.detail(variables.id),
                    refetchType: 'active',
                })
            }
        },
    })
}

// Delete product
export function useDeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id }: { id: string }) =>
            deleteProduct(id),
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: productKeys.lists() })
            await queryClient.cancelQueries({ queryKey: productKeys.detail(id) })

            const previousList = queryClient.getQueryData<Product[]>(productKeys.list())
            const previousDetail = queryClient.getQueryData<Product | null | undefined>(
                productKeys.detail(id)
            )

            queryClient.setQueryData<Product[]>(productKeys.list(), (old) =>
                old ? old.filter((p) => p.id !== id) : old
            )
            queryClient.removeQueries({ queryKey: productKeys.detail(id) })

            return { previousList, previousDetail }
        },
        onError: (_err, variables, context) => {
            if (context?.previousList !== undefined) {
                queryClient.setQueryData(productKeys.list(), context.previousList)
            }
            if (context?.previousDetail !== undefined) {
                queryClient.setQueryData(
                    productKeys.detail(variables.id),
                    context.previousDetail
                )
            }
        },
    })
}

// Update stock
export function useUpdateStock() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
            updateStock(id, quantity),
        onMutate: async ({ id, quantity }) => {
            await queryClient.cancelQueries({ queryKey: productKeys.lists() })
            await queryClient.cancelQueries({ queryKey: productKeys.detail(id) })

            const previousList = queryClient.getQueryData<Product[]>(productKeys.list())
            const previousDetail = queryClient.getQueryData<Product | null | undefined>(
                productKeys.detail(id)
            )

            const now = new Date()
            queryClient.setQueryData<Product[]>(productKeys.list(), (old) => {
                if (!old) return old
                return old.map((p) =>
                    p.id === id ? { ...p, stock: quantity, updatedAt: now } : p
                )
            })
            queryClient.setQueryData<Product | null>(productKeys.detail(id), (old) => {
                if (!old) return old
                return { ...old, stock: quantity, updatedAt: now }
            })

            return { previousList, previousDetail }
        },
        onError: (_err, variables, context) => {
            if (context?.previousList !== undefined) {
                queryClient.setQueryData(productKeys.list(), context.previousList)
            }
            if (context?.previousDetail !== undefined) {
                queryClient.setQueryData(
                    productKeys.detail(variables.id),
                    context.previousDetail
                )
            }
        },
    })
}
