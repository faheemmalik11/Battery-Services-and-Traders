'use client'

import { useRouter } from 'next/navigation'
import { useCreateProduct } from '@/features/products/hooks/useProducts'
import { ProductForm } from '@/features/products/components/ProductForm'
import { parseProductFormData } from '@/features/products/lib/parseProductForm'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const createProduct = useCreateProduct()

  const handleSubmit = async (formData: FormData, imageFile?: File) => {
    try {
      const data = parseProductFormData(formData)
      await createProduct.mutateAsync({ data, imageFile })
      toast.success('Product created successfully')
      router.push('/cms/products')
      router.refresh()
    } catch {
      toast.error('Failed to create product')
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ProductForm onSubmit={handleSubmit} isLoading={createProduct.isPending} />
    </div>
  )
}
