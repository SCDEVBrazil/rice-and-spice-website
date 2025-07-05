'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Database,
  Download,
  Shield
} from 'lucide-react'
import { CleanSlateManager } from '@/lib/admin/clean-slate-manager'
import React from 'react'

export function CleanSlateComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [results, setResults] = useState<{
    success: boolean
    message: string
    deletedCount: number
    importedCount: number
    steps: string[]
  } | null>(null)
  const [currentItemCount, setCurrentItemCount] = useState<number | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Load current menu item count
  const loadCurrentCount = async () => {
    try {
      const count = await CleanSlateManager.getCurrentMenuItemCount()
      setCurrentItemCount(count)
    } catch (error) {
      console.error('Error loading current count:', error)
    }
  }

  // Perform the clean slate operation
  const performCleanSlate = async () => {
    setIsLoading(true)
    setResults(null)
    setCurrentStep('Initializing clean slate operation...')

    try {
      const result = await CleanSlateManager.performCleanSlate()
      setResults(result)
      
      if (result.success) {
        setCurrentStep('Clean slate operation completed successfully!')
        // Refresh the count
        await loadCurrentCount()
      } else {
        setCurrentStep('Clean slate operation failed')
      }
    } catch (error) {
      setResults({
        success: false,
        message: `Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        deletedCount: 0,
        importedCount: 0,
        steps: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      })
      setCurrentStep('Operation failed')
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }

  // Verify data integrity
  const verifyData = async () => {
    setIsLoading(true)
    setCurrentStep('Verifying data integrity...')

    try {
      const verification = await CleanSlateManager.verifyDataIntegrity()
      
      if (verification.success) {
        setResults({
          success: true,
          message: `Data integrity verified: ${verification.totalItems} items found`,
          deletedCount: 0,
          importedCount: verification.totalItems,
          steps: [
            `✅ Found ${verification.totalItems} total items`,
            `✅ Categories: ${Object.keys(verification.categoryCounts).length}`,
            `✅ No data integrity issues found`,
            ...Object.entries(verification.categoryCounts).map(([cat, count]) => `   • ${cat}: ${count} items`)
          ]
        })
      } else {
        setResults({
          success: false,
          message: `Data integrity issues found: ${verification.issues.length} problems`,
          deletedCount: 0,
          importedCount: verification.totalItems,
          steps: [
            `❌ Found ${verification.issues.length} integrity issues:`,
            ...verification.issues.map(issue => `   • ${issue}`)
          ]
        })
      }
    } catch (error) {
      setResults({
        success: false,
        message: 'Failed to verify data integrity',
        deletedCount: 0,
        importedCount: 0,
        steps: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      })
    } finally {
      setIsLoading(false)
      setCurrentStep('')
    }
  }

  // Load count on component mount
  React.useEffect(() => {
    loadCurrentCount()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Database className="w-5 h-5" />
            Clean Slate Menu Management
          </CardTitle>
          <CardDescription className="text-amber-100">
            Completely wipe and rebuild your menu database with fresh, authentic data
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Current Status */}
      <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
        <CardHeader>
          <CardTitle className="text-yellow-400">Current Database Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-amber-100">Current Menu Items:</span>
            <Badge variant="secondary" className="bg-yellow-600 text-amber-900">
              {currentItemCount !== null ? `${currentItemCount} items` : 'Loading...'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-amber-100">Target Items (Fresh Import):</span>
            <Badge variant="secondary" className="bg-green-600 text-white">
              141 items
            </Badge>
          </div>

          <Button 
            onClick={loadCurrentCount}
            variant="outline" 
            size="sm"
            className="w-full border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Count
          </Button>
        </CardContent>
      </Card>

      {/* Operations */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Clean Slate Operation */}
        <Card className="bg-red-900/30 backdrop-blur-sm border-2 border-red-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Trash2 className="w-5 h-5" />
              Clean Slate Operation
            </CardTitle>
            <CardDescription className="text-red-200">
              Wipe ALL menu items and import fresh data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-200 bg-red-900/50">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                <strong>Warning:</strong> This will permanently delete all current menu items and replace them with fresh data.
              </AlertDescription>
            </Alert>

            {!showConfirmation ? (
              <Button 
                onClick={() => setShowConfirmation(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                <Shield className="w-4 h-4 mr-2" />
                Start Clean Slate
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-red-200 text-sm font-medium">
                  Are you absolutely sure? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={performCleanSlate}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Yes, Proceed'}
                  </Button>
                  <Button 
                    onClick={() => setShowConfirmation(false)}
                    variant="outline"
                    className="flex-1 border-red-600/50 text-red-400 hover:bg-red-600/20"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification */}
        <Card className="bg-blue-900/30 backdrop-blur-sm border-2 border-blue-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <CheckCircle className="w-5 h-5" />
              Data Verification
            </CardTitle>
            <CardDescription className="text-blue-200">
              Check current data integrity and structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={verifyData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              <Database className="w-4 h-4 mr-2" />
              Verify Data Integrity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Results */}
      {isLoading && (
        <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
                <span className="text-yellow-400 font-medium">Processing...</span>
              </div>
              <Progress value={undefined} className="w-full" />
              <p className="text-amber-100 text-sm">{currentStep}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <Card className={`backdrop-blur-sm border-2 ${
          results.success 
            ? 'bg-green-900/30 border-green-600/50' 
            : 'bg-red-900/30 border-red-600/50'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              results.success ? 'text-green-400' : 'text-red-400'
            }`}>
              {results.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              Operation {results.success ? 'Completed' : 'Failed'}
            </CardTitle>
            <CardDescription className={results.success ? 'text-green-200' : 'text-red-200'}>
              {results.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${results.success ? 'text-green-400' : 'text-red-400'}`}>
                  {results.deletedCount}
                </div>
                <div className="text-sm text-amber-100">Items Deleted</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${results.success ? 'text-green-400' : 'text-red-400'}`}>
                  {results.importedCount}
                </div>
                <div className="text-sm text-amber-100">Items Imported</div>
              </div>
            </div>

            {/* Detailed Steps */}
            <div className="space-y-2">
              <h4 className="font-medium text-amber-100">Operation Steps:</h4>
              <div className="bg-black/20 rounded-lg p-3 space-y-1">
                {results.steps.map((step, index) => (
                  <div key={index} className="text-sm text-amber-100 font-mono">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={loadCurrentCount}
                variant="outline"
                size="sm"
                className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Count
              </Button>
              <Button 
                onClick={verifyData}
                variant="outline"
                size="sm"
                className="border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}