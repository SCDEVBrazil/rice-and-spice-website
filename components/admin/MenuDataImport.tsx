'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { adminData } from '@/lib/admin'
import { TIFFIN_ITEMS } from '@/lib/admin/menu-imports/tiffin-data'
import { VEG_STARTER_ITEMS } from '@/lib/admin/menu-imports/veg-starter-data'
import { NON_VEG_STARTER_ITEMS } from '@/lib/admin/menu-imports/non-veg-starter-data'
import { VEG_CURRY_ITEMS } from '@/lib/admin/menu-imports/veg-curry-data'
import { EGG_CURRY_ITEMS } from '@/lib/admin/menu-imports/egg-curry-data'
import { NON_VEG_CURRY_ITEMS } from '@/lib/admin/menu-imports/non-veg-curry-data'
import { BREAD_ITEMS } from '@/lib/admin/menu-imports/bread-data'
import { RICE_ITEMS } from '@/lib/admin/menu-imports/rice-data'
import { OTHERS_ITEMS } from '@/lib/admin/menu-imports/others-data'
import { NOODLES_ITEMS } from '@/lib/admin/menu-imports/noodles-data'
import { TANDOOR_ITEMS } from '@/lib/admin/menu-imports/tandoor-data'

interface MenuDataImportProps {
  onMessage: (message: string, type: 'success' | 'error') => void
}

export function MenuDataImport({ onMessage }: MenuDataImportProps) {
  const [loading, setLoading] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<'idle' | 'clearing' | 'importing' | 'complete'>('idle')
  const [importedCount, setImportedCount] = useState(0)
  const [localMessage, setLocalMessage] = useState('')
  const [localMessageType, setLocalMessageType] = useState<'success' | 'error'>('success')

  const showLocalMessage = (text: string, type: 'success' | 'error') => {
    setLocalMessage(text)
    setLocalMessageType(type)
    onMessage(text, type)
    setTimeout(() => setLocalMessage(''), 5000)
  }

  // All menu categories with their data
  const menuCategories = [
    { name: 'Tiffin', items: TIFFIN_ITEMS, count: TIFFIN_ITEMS.length },
    { name: 'Veg Starter', items: VEG_STARTER_ITEMS, count: VEG_STARTER_ITEMS.length },
    { name: 'Non Veg Starter', items: NON_VEG_STARTER_ITEMS, count: NON_VEG_STARTER_ITEMS.length },
    { name: 'Veg Curry', items: VEG_CURRY_ITEMS, count: VEG_CURRY_ITEMS.length },
    { name: 'Egg Curry', items: EGG_CURRY_ITEMS, count: EGG_CURRY_ITEMS.length },
    { name: 'Non Veg Curry', items: NON_VEG_CURRY_ITEMS, count: NON_VEG_CURRY_ITEMS.length },
    { name: 'Bread', items: BREAD_ITEMS, count: BREAD_ITEMS.length },
    { name: 'Rice', items: RICE_ITEMS, count: RICE_ITEMS.length },
    { name: 'Others', items: OTHERS_ITEMS, count: OTHERS_ITEMS.length },
    { name: 'Noodles', items: NOODLES_ITEMS, count: NOODLES_ITEMS.length },
    { name: 'Tandoor', items: TANDOOR_ITEMS, count: TANDOOR_ITEMS.length }
  ]

  const totalItems = menuCategories.reduce((sum, cat) => sum + cat.count, 0)

  const handleClearAllData = async () => {
    if (!confirm('⚠️ WARNING: This will DELETE ALL existing menu items from the database. This action cannot be undone. Are you sure?')) {
      return
    }

    if (!confirm('Are you ABSOLUTELY sure? This will permanently delete all menu data.')) {
      return
    }

    setLoading(true)
    setImportStatus('clearing')
    
    try {
      const currentItems = await adminData.getMenuItems()
      
      for (const item of currentItems) {
        await adminData.deleteMenuItem(item.id)
      }
      
      showLocalMessage(`Successfully cleared ${currentItems.length} menu items from database`, 'success')
      setImportStatus('idle')
    } catch (error) {
      console.error('Failed to clear menu data:', error)
      showLocalMessage('Failed to clear menu data. Please try again.', 'error')
      setImportStatus('idle')
    } finally {
      setLoading(false)
    }
  }

  const handleImportCategory = async (categoryName: string, items: any[]) => {
    if (!confirm(`This will import ${items.length} ${categoryName} items. Continue?`)) {
      return
    }

    setLoading(true)
    setImportStatus('importing')
    setImportProgress(0)
    setImportedCount(0)
    
    try {
      const totalItems = items.length
      
      for (let i = 0; i < totalItems; i++) {
        const item = items[i]
        
        await adminData.addMenuItem({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          isPopular: item.isPopular,
          isAvailable: item.isAvailable
        })
        
        setImportedCount(i + 1)
        setImportProgress(((i + 1) / totalItems) * 100)
        
        // Small delay to prevent overwhelming Firebase
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      setImportStatus('complete')
      showLocalMessage(`Successfully imported ${totalItems} ${categoryName} items!`, 'success')
    } catch (error) {
      console.error(`Failed to import ${categoryName} data:`, error)
      showLocalMessage(`Failed to import ${categoryName} data. Please try again.`, 'error')
      setImportStatus('idle')
    } finally {
      setLoading(false)
    }
  }

  const handleImportAllCategories = async () => {
    if (!confirm(`This will import ALL ${totalItems} menu items across all categories. This may take several minutes. Continue?`)) {
      return
    }

    setLoading(true)
    setImportStatus('importing')
    setImportProgress(0)
    setImportedCount(0)
    
    try {
      let totalImported = 0
      
      for (const category of menuCategories) {
        showLocalMessage(`Importing ${category.name} section...`, 'success')
        
        for (let i = 0; i < category.items.length; i++) {
          const item = category.items[i]
          
          await adminData.addMenuItem({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            isPopular: item.isPopular,
            isAvailable: item.isAvailable
          })
          
          totalImported++
          setImportedCount(totalImported)
          setImportProgress((totalImported / totalItems) * 100)
          
          // Small delay to prevent overwhelming Firebase
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      setImportStatus('complete')
      showLocalMessage(`🎉 Successfully imported ALL ${totalItems} menu items!`, 'success')
    } catch (error) {
      console.error('Failed to import all menu data:', error)
      showLocalMessage('Failed to import all menu data. Please try again.', 'error')
      setImportStatus('idle')
    } finally {
      setLoading(false)
    }
  }

  const handleTestImport = async () => {
    setLoading(true)
    
    try {
      await adminData.addMenuItem({
        name: 'Test Import Item',
        description: 'This is a test item to verify import functionality',
        price: 1.00,
        category: 'Tiffin',
        isPopular: false,
        isAvailable: true
      })
      
      showLocalMessage('Test import successful! Import system is working.', 'success')
    } catch (error) {
      console.error('Test import failed:', error)
      showLocalMessage('Test import failed. Please check your connection.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Menu Data Import
        </h2>
        <p className="text-amber-100">Import complete authentic menu data ({totalItems} items) into Firebase</p>
      </div>

      {/* Warning Alert */}
      <Alert className="border-red-500 bg-red-900/50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-red-200">
          <strong>WARNING:</strong> These operations will modify your live database. Make sure you understand what each button does before proceeding.
        </AlertDescription>
      </Alert>

      {/* Local Message Display */}
      {localMessage && (
        <Alert className={`${localMessageType === 'success' ? 'border-green-500 bg-green-900/50' : 'border-red-500 bg-red-900/50'}`}>
          {localMessageType === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertDescription className={localMessageType === 'success' ? 'text-green-200' : 'text-red-200'}>
            {localMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Import Progress */}
      {importStatus === 'importing' && (
        <Card className="bg-yellow-900/50 border-yellow-600/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-medium">Importing Menu Items...</span>
                <Badge className="bg-blue-600 text-white">
                  {importedCount} / {totalItems}
                </Badge>
              </div>
              <Progress value={importProgress} className="h-2" />
              <p className="text-sm text-amber-100">
                Please wait while we import all menu items. This may take several minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Messages */}
      {importStatus === 'clearing' && (
        <Card className="bg-red-900/50 border-red-600/50">
          <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-400" />
            <p className="text-red-200">Clearing all existing menu data...</p>
          </CardContent>
        </Card>
      )}

      {importStatus === 'complete' && (
        <Card className="bg-green-900/50 border-green-600/50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-4 text-green-400" />
            <p className="text-green-200">Import completed successfully!</p>
            <Badge className="mt-2 bg-green-600 text-white">
              {importedCount} items imported
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-900/50 border-blue-600/50">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Test Import
            </CardTitle>
            <CardDescription className="text-blue-200">
              Test the import system with a single item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleTestImport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Test Import System
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-green-900/50 border-green-600/50">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Import All Menu
            </CardTitle>
            <CardDescription className="text-green-200">
              Import all {totalItems} menu items at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleImportAllCategories}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white border-green-500 w-full"
            >
              {loading && importStatus === 'importing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Import All ({totalItems} items)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-red-900/50 border-red-600/50">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Clear All Data
            </CardTitle>
            <CardDescription className="text-red-200">
              Delete all existing menu items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleClearAllData}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white border-red-500 w-full"
            >
              {loading && importStatus === 'clearing' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Individual Category Imports */}
      <Card className="bg-yellow-900/50 border-yellow-600/50">
        <CardHeader>
          <CardTitle className="text-yellow-400">Import by Category</CardTitle>
          <CardDescription className="text-amber-100">
            Import individual menu categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuCategories.map(category => (
              <Button
                key={category.name}
                onClick={() => handleImportCategory(category.name, category.items)}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-yellow-500 h-auto p-4 flex flex-col items-center"
              >
                <span className="font-medium">{category.name}</span>
                <span className="text-sm opacity-80">({category.count} items)</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-amber-900/50 border-amber-600/50">
        <CardHeader>
          <CardTitle className="text-amber-400">Complete Import Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-amber-100">
          <div className="space-y-2">
            <p><strong>Recommended Process:</strong></p>
            <p><strong>Step 1:</strong> Test the import system with "Test Import System"</p>
            <p><strong>Step 2:</strong> Clear existing data with "Clear All Data"</p>
            <p><strong>Step 3:</strong> Import all authentic menu data with "Import All ({totalItems} items)"</p>
            <p><strong>Step 4:</strong> Verify data in Menu Management section</p>
          </div>
          <div className="mt-4 p-3 bg-amber-800/30 rounded">
            <p className="text-sm"><strong>Total Items:</strong> {totalItems} authentic menu items across 11 categories</p>
            <p className="text-sm"><strong>Import Time:</strong> Approximately 3-5 minutes for all items</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}