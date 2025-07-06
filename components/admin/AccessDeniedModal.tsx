'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Crown, X, AlertTriangle } from 'lucide-react'

interface AccessDeniedModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessDeniedModal({ isOpen, onClose }: AccessDeniedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 bg-gradient-to-br from-red-900 to-amber-900 border-2 border-red-600/50 text-amber-100">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="flex items-center gap-2 text-red-400 text-lg sm:text-xl">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            Access Denied
          </DialogTitle>
          <DialogDescription className="text-amber-200 text-sm">
            You don't have permission to access this section
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Main Alert - Mobile Responsive */}
          <Alert className="border-red-500 bg-red-900/50">
            <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <AlertDescription className="text-red-200 text-sm">
              <strong>Owner Access Required:</strong> Only users with Owner privileges can access Admin Management.
            </AlertDescription>
          </Alert>

          {/* Your Current Role - Mobile Responsive */}
          <div className="bg-yellow-900/30 rounded-lg p-3 sm:p-4 border border-yellow-600/30">
            <h3 className="flex items-center gap-2 font-semibold text-yellow-400 mb-2 text-sm sm:text-base">
              <Shield className="w-4 h-4 flex-shrink-0" />
              Your Current Role
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="bg-blue-600 text-blue-100 px-2 py-1 rounded text-xs sm:text-sm font-medium self-start">
                <Shield className="w-3 h-3 inline mr-1" />
                Manager
              </div>
              <span className="text-amber-200 text-xs sm:text-sm">- Restaurant management access</span>
            </div>
          </div>

          {/* Required Role - Mobile Responsive */}
          <div className="bg-yellow-900/30 rounded-lg p-3 sm:p-4 border border-yellow-600/30">
            <h3 className="flex items-center gap-2 font-semibold text-yellow-400 mb-2 text-sm sm:text-base">
              <Crown className="w-4 h-4 flex-shrink-0" />
              Required Role
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs sm:text-sm font-medium self-start">
                <Crown className="w-3 h-3 inline mr-1" />
                Owner
              </div>
              <span className="text-amber-200 text-xs sm:text-sm">- Full admin management access</span>
            </div>
          </div>

          {/* What to Do - Mobile Responsive */}
          <div className="bg-blue-900/30 rounded-lg p-3 sm:p-4 border border-blue-600/30">
            <h3 className="flex items-center gap-2 font-semibold text-blue-400 mb-2 text-sm sm:text-base">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              How to Get Access
            </h3>
            <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">
              Contact an existing <strong>Owner</strong> to promote your account. 
              Owners can change user roles in the Admin Management section.
            </p>
          </div>

          {/* Close Button - Mobile Responsive */}
          <div className="flex justify-stretch sm:justify-end pt-3 sm:pt-4 border-t border-red-600/30">
            <Button
              onClick={onClose}
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500 py-2.5 sm:py-2"
            >
              <X className="w-4 h-4 mr-2" />
              Understood
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}