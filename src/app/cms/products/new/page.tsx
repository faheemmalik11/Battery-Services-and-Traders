'use client'

import { useRouter } from 'next/navigation'
import { useCreateProduct } from '@/features/products/hooks/useProducts'
import { ProductForm } from '@/features/products/components/ProductForm'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const createProduct = useCreateProduct()

  const handleSubmit = async (
    data: any, // CreateProductInput
    newImageFiles: File[],
    removedPublicIds: string[]
  ) => {
    try {
      await createProduct.mutateAsync({
        data,
        imageFiles: newImageFiles
      })
      toast.success('Product created successfully')
      router.push('/cms/products')
      router.refresh()
    } catch (error) {
      console.error('Create error:', error)
      toast.error('Failed to create product')
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ProductForm onSubmit={handleSubmit} isLoading={createProduct.isPending} />
    </div>
  )
}