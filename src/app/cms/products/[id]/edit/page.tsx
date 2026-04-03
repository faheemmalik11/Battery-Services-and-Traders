'use client'

import { useRouter, useParams } from 'next/navigation'
import { useProduct, useUpdateProduct } from '@/features/products/hooks/useProducts'
import { ProductForm } from '@/features/products/components/ProductForm'
import { parseProductFormData } from '@/features/products/lib/parseProductForm'
import { toast } from 'sonner'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { data: product, isLoading: isLoadingProduct } = useProduct(id)
  const updateProduct = useUpdateProduct()

  const handleSubmit = async (formData: FormData, imageFile?: File) => {
    if (!product) return

    try {
      const data = parseProductFormData(formData)
      await updateProduct.mutateAsync({
        id,
        data,
        newImageFile: imageFile,
        oldPublicId: product.publicId,
      })
      toast.success('Product updated successfully')
      router.push('/cms/products')
      router.refresh()
    } catch {
      toast.error('Failed to update product')
    }
  }

  if (isLoadingProduct) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div>Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={updateProduct.isPending}
      />
    </div>
  )
}
