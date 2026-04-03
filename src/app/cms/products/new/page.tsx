'use client'

import { useRouter } from 'next/navigation'
import { useCreateProduct } from '@/features/products/hooks/useProducts'
import { ProductForm } from '@/features/products/components/ProductForm'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const createProduct = useCreateProduct()

  const handleSubmit = async (formData: FormData, imageFile?: File) => {
    const data = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      category: formData.get('category') as any,
      voltage: Number(formData.get('voltage')) as 6 | 12 | 24 | 48,
      capacity: Number(formData.get('capacity')),
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      description: formData.get('description') as string,
    }

    try {
      await createProduct.mutateAsync({ data, imageFile })
      toast.success('Product created successfully')
      router.push('/cms/products')
      router.refresh()
    } catch (error) {
      toast.error('Failed to create product')
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ProductForm onSubmit={handleSubmit} isLoading={createProduct.isPending} />
    </div>
  )
}