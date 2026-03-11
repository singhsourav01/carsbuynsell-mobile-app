import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ConfirmDialog from '@/components/ConfirmDialog'
import { mockCategories } from '@/types/mock-data'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Car } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type Category = typeof mockCategories[0]

export default function Categories() {
  const [categories, setCategories] = useState(mockCategories)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleCreate = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: String(categories.length + 1),
        name: newCategoryName,
        icon: 'Car',
        listingCount: 0,
      }
      setCategories([...categories, newCategory])
      toast.success('Category created successfully')
      setCreateOpen(false)
      setNewCategoryName('')
    }
  }

  const handleEdit = () => {
    if (selectedCategory && newCategoryName.trim()) {
      setCategories(
        categories.map((c) =>
          c.id === selectedCategory.id ? { ...c, name: newCategoryName } : c
        )
      )
      toast.success('Category updated successfully')
      setEditOpen(false)
      setSelectedCategory(null)
      setNewCategoryName('')
    }
  }

  const handleDelete = () => {
    if (selectedCategory) {
      setCategories(categories.filter((c) => c.id !== selectedCategory.id))
      toast.success('Category deleted successfully')
      setDeleteOpen(false)
      setSelectedCategory(null)
    }
  }

  const openEdit = (category: Category) => {
    setSelectedCategory(category)
    setNewCategoryName(category.name)
    setEditOpen(true)
  }

  const openDelete = (category: Category) => {
    setSelectedCategory(category)
    setDeleteOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Categories</h1>
          <p className="text-gray-500">Manage vehicle categories</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a new vehicle category to the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label>Category Name</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Sedan, SUV"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-gray-500">
                    {category.listingCount} listings
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-600" onClick={() => openDelete(category)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Category Name</Label>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
