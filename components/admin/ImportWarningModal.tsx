'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  AlertTriangle, 
  Database, 
  Shield, 
  X,
  FileText,
  Clock,
  Users
} from 'lucide-react'

interface ImportWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ImportWarningModal({ isOpen, onClose, onConfirm }: ImportWarningModalProps) {
  const [hasReadWarning, setHasReadWarning] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')

  const handleConfirm = () => {
    if (hasReadWarning && confirmationText === 'CONFIRM') {
      onConfirm()
      // Reset modal state
      setHasReadWarning(false)
      setConfirmationText('')
    }
  }

  const handleClose = () => {
    onClose()
    // Reset modal state
    setHasReadWarning(false)
    setConfirmationText('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-amber-900 to-yellow-900 border-2 border-yellow-600/50 text-amber-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-400 text-xl">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            ADVANCED FEATURE WARNING
          </DialogTitle>
          <DialogDescription className="text-amber-200">
            You are about to access the Menu Data Import system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          {/* Main Warning */}
          <Alert className="border-red-500 bg-red-900/50">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>CAUTION:</strong> This feature is designed for advanced users and specific scenarios only.
            </AlertDescription>
          </Alert>

          {/* What Import Does */}
          <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-600/30">
            <h3 className="flex items-center gap-2 font-semibold text-yellow-400 mb-3">
              <Database className="w-5 h-5" />
              What Import Does
            </h3>
            <ul className="space-y-2 text-amber-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong>Overwrites existing menu data</strong> - All current menu items will be replaced</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong>Cannot be undone</strong> - Previous menu data will be permanently lost</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span><strong>Affects live website</strong> - Changes will be visible to customers immediately</span>
              </li>
            </ul>
          </div>

          {/* When to Use */}
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600/30">
            <h3 className="flex items-center gap-2 font-semibold text-blue-400 mb-3">
              <FileText className="w-5 h-5" />
              When to Use Import
            </h3>
            <ul className="space-y-2 text-amber-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Complete menu overhaul (new restaurant season)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Disaster recovery (restoring from backup)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Initial setup (first time menu creation)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Bulk updates across all menu items</span>
              </li>
            </ul>
          </div>

          {/* Normal Operations */}
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-600/30">
            <h3 className="flex items-center gap-2 font-semibold text-green-400 mb-3">
              <Users className="w-5 h-5" />
              For Normal Menu Changes
            </h3>
            <p className="text-amber-100 text-sm">
              For daily operations like updating prices, adding new items, or editing descriptions, 
              use the <strong>"Menu Management"</strong> tab instead. It's safer and designed for regular use.
            </p>
          </div>

          {/* Confirmation Section */}
          <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-600/30">
            <h3 className="flex items-center gap-2 font-semibold text-gray-400 mb-3">
              <Shield className="w-5 h-5" />
              Confirmation Required
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="warning-read" 
                  checked={hasReadWarning}
                  onCheckedChange={(checked) => setHasReadWarning(checked as boolean)}
                />
                <label htmlFor="warning-read" className="text-sm text-amber-100 cursor-pointer">
                  I have read and understand the warnings above
                </label>
              </div>

              {hasReadWarning && (
                <div className="space-y-2">
                  <label className="text-sm text-amber-100">
                    Type <strong className="text-red-400">CONFIRM</strong> to proceed:
                  </label>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="w-full px-3 py-2 bg-yellow-900/30 border border-yellow-600/50 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Type CONFIRM here"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-yellow-600/30 bg-gradient-to-br from-amber-900 to-yellow-900 sticky bottom-0 -mx-1 px-1">
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-yellow-400 border-2 text-yellow-400 bg-yellow-900/20 hover:bg-yellow-600/30 hover:text-yellow-300 font-medium"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!hasReadWarning || confirmationText !== 'CONFIRM'}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Proceed to Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}