'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  PlusCircle,
  Edit3,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Loader2,
  Save
} from 'lucide-react'
import { adminData } from '@/lib/admin'
import type { MenuItem } from '@/lib/admin/types'

interface MenuManagementProps {
  onMessage: (message: string, type: 'success' | 'error') => void
}

export function MenuManagement({ onMessage }: MenuManagementProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [menuLoading, setMenuLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // New item form state
  const [newItemForm, setNewItemForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    isPopular: false,
    isAvailable: true
  })

  const categories = [
    { key: 'tiffin', label: 'Tiffin', value: 'Tiffin' },
    { key: 'veg-starter', label: 'Veg Starter', value: 'Veg Starter' },
    { key: 'non-veg-starter', label: 'Non Veg Starter', value: 'Non Veg Starter' },
    { key: 'veg-curry', label: 'Veg Curry', value: 'Veg Curry' },
    { key: 'egg-curry', label: 'Egg Curry', value: 'Egg Curry' },
    { key: 'non-veg-curry', label: 'Non Veg Curry', value: 'Non Veg Curry' },
    { key: 'bread', label: 'Bread', value: 'Bread' },
    { key: 'rice', label: 'Rice', value: 'Rice' },
    { key: 'others', label: 'Others', value: 'Others' },
    { key: 'noodles', label: 'Noodles', value: 'Noodles' },
    { key: 'tandoor', label: 'Tandoor', value: 'Tandoor' }
  ]

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    try {
      setMenuLoading(true)
      const items = await adminData.getMenuItems()
      setMenuItems(items)
    } catch (error) {
      console.error('Failed to load menu items:', error)
      onMessage('Failed to load menu items', 'error')
    } finally {
      setMenuLoading(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await adminData.addMenuItem({
        name: newItemForm.name,
        description: newItemForm.description,
        price: newItemForm.price,
        category: newItemForm.category,
        isPopular: newItemForm.isPopular,
        isAvailable: newItemForm.isAvailable
      })
      
      setNewItemForm({
        name: '',
        description: '',
        price: 0,
        category: '',
        isPopular: false,
        isAvailable: true
      })
      
      setShowAddDialog(false)
      await loadMenuItems()
      onMessage('Menu item added successfully!', 'success')
    } catch (error) {
      console.error('Failed to add menu item:', error)
      onMessage('Failed to add menu item. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    
    setLoading(true)
    
    try {
      await adminData.updateMenuItem(editingItem.id, {
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        category: editingItem.category,
        isPopular: editingItem.isPopular,
        isAvailable: editingItem.isAvailable
      })
      
      setEditingItem(null)
      setShowEditDialog(false)
      await loadMenuItems()
      onMessage('Menu item updated successfully!', 'success')
    } catch (error) {
      console.error('Failed to update menu item:', error)
      onMessage('Failed to update menu item. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    
    setLoading(true)
    
    try {
      await adminData.deleteMenuItem(id)
      await loadMenuItems()
      onMessage('Menu item deleted successfully!', 'success')
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      onMessage('Failed to delete menu item. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAvailability = async (id: string) => {
    try {
      await adminData.toggleItemAvailability(id)
      await loadMenuItems()
      onMessage('Item availability updated!', 'success')
    } catch (error) {
      console.error('Failed to toggle availability:', error)
      onMessage('Failed to update availability. Please try again.', 'error')
    }
  }

  const handleTogglePopularity = async (id: string) => {
    try {
      await adminData.toggleItemPopularity(id)
      await loadMenuItems()
      onMessage('Item popularity updated!', 'success')
    } catch (error) {
      console.error('Failed to toggle popularity:', error)
      onMessage('Failed to update popularity. Please try again.', 'error')
    }
  }

  const getItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category)
  }

  const renderCategoryItems = (category: string) => {
    const items = getItemsByCategory(category)
    
    if (menuLoading) {
      return (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-yellow-400" />
          <p className="text-amber-100">Loading menu items...</p>
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
          <CardContent className="p-8 text-center">
            <p className="text-amber-100 mb-4">No items found in this category.</p>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500"
                  onClick={() => setNewItemForm({...newItemForm, category: category})}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add First Item to {category}
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {items.map(item => (
          <Card key={item.id} className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-yellow-400">{item.name}</h3>
                    {item.isPopular && (
                      <Badge className="bg-yellow-600 text-amber-900 border-yellow-500">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <Badge className={`${item.isAvailable ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500'} text-white`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <p className="text-amber-100 mb-2">{item.description}</p>
                  <p className="text-xl font-bold text-yellow-400">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`${
                          item.isAvailable 
                            ? 'bg-green-600 hover:bg-green-700 text-white border-green-500' 
                            : 'bg-red-600 hover:bg-red-700 text-white border-red-500'
                        } border-2 shadow-lg`}
                      >
                        {item.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => handleTogglePopularity(item.id)}
                        className={`${
                          item.isPopular 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-yellow-500' 
                            : 'bg-gray-600 hover:bg-gray-700 text-white border-gray-500'
                        } border-2 shadow-lg`}
                      >
                        <Star className={`w-4 h-4 ${item.isPopular ? 'fill-current' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.isPopular ? 'Remove from Popular' : 'Mark as Popular'}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingItem(item)
                          setShowEditDialog(true)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500 shadow-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Item</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-500 shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Item</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Menu Management
            </h2>
            <p className="text-amber-100">Manage your restaurant's menu items by category</p>
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-yellow-900/95 border-yellow-600/50 text-amber-100 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-yellow-400">Add New Menu Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-amber-100">Item Name</Label>
                    <Input
                      id="name"
                      value={newItemForm.name}
                      onChange={(e) => setNewItemForm({...newItemForm, name: e.target.value})}
                      className="border-yellow-600/50 bg-yellow-900/30 text-amber-100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-amber-100">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newItemForm.price || ''}
                      onChange={(e) => setNewItemForm({...newItemForm, price: parseFloat(e.target.value) || 0})}
                      onFocus={(e) => e.target.select()}
                      className="border-yellow-600/50 bg-yellow-900/30 text-amber-100"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-amber-100">Description</Label>
                  <Textarea
                    id="description"
                    value={newItemForm.description}
                    onChange={(e) => setNewItemForm({...newItemForm, description: e.target.value})}
                    className="border-yellow-600/50 bg-yellow-900/30 text-amber-100"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-amber-100">Category</Label>
                  <Select value={newItemForm.category} onValueChange={(value) => setNewItemForm({...newItemForm, category: value})}>
                    <SelectTrigger className="border-yellow-600/50 bg-yellow-900/30 text-amber-100">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.key} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="popular"
                      checked={newItemForm.isPopular}
                      onCheckedChange={(checked) => setNewItemForm({...newItemForm, isPopular: checked})}
                    />
                    <Label htmlFor="popular" className="text-amber-100">Popular Item</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={newItemForm.isAvailable}
                      onCheckedChange={(checked) => setNewItemForm({...newItemForm, isAvailable: checked})}
                    />
                    <Label htmlFor="available" className="text-amber-100">Available</Label>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500 w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Menu Item
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tab-based Menu Management */}
        <Tabs defaultValue="tiffin" className="w-full">
          <TabsList className="flex justify-between bg-yellow-900/40 border-2 border-yellow-600/30 mb-8 rounded-lg gap-1 px-4 py-4 w-full">
            {categories.map(category => (
              <TabsTrigger 
                key={category.key}
                value={category.key} 
                className="data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 text-amber-100 font-medium hover:bg-yellow-700/50 rounded-md text-base whitespace-nowrap px-3 py-3 flex-shrink-0"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.key} value={category.key}>
              {renderCategoryItems(category.value)}
            </TabsContent>
          ))}
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-yellow-900/95 border-yellow-600/50 text-amber-100 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-yellow-400">Edit Menu Item</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <form onSubmit={handleEditItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-amber-100">Item Name</Label>
                    <Input
                      id="edit-name"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                      className="border-yellow-600/50 bg-yellow-900/30 text-amber-100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price" className="text-amber-100">Price ($)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={editingItem.price || ''}
                      onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})}
                      onFocus={(e) => e.target.select()}
                      className="border-yellow-600/50 bg-yellow-900/30 text-amber-100"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-amber-100">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    className="border-yellow-600/50 bg-yellow-900/30 text-amber-100"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category" className="text-amber-100">Category</Label>
                  <Select value={editingItem.category} onValueChange={(value) => setEditingItem({...editingItem, category: value})}>
                    <SelectTrigger className="border-yellow-600/50 bg-yellow-900/30 text-amber-100">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.key} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-popular"
                      checked={editingItem.isPopular}
                      onCheckedChange={(checked) => setEditingItem({...editingItem, isPopular: checked})}
                    />
                    <Label htmlFor="edit-popular" className="text-amber-100">Popular Item</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-available"
                      checked={editingItem.isAvailable}
                      onCheckedChange={(checked) => setEditingItem({...editingItem, isAvailable: checked})}
                    />
                    <Label htmlFor="edit-available" className="text-amber-100">Available</Label>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500 w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Menu Item
                    </>
                  )}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}