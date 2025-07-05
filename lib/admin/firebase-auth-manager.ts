// lib/admin/firebase-auth-manager.ts

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  addDoc,
  query,
  where,
  updateDoc
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export interface AdminUser {
  uid: string
  email: string
  role: 'owner' | 'manager'
  createdAt: string
  lastLogin?: string
  invitedBy: string
}

export interface InviteCode {
  id: string
  code: string
  createdBy: string
  createdAt: string
  expiresAt: string
  usedBy?: string
  usedAt?: string
  isUsed: boolean
  maxUses: number
  currentUses: number
}

export class FirebaseAuthManager {
  // Generate invite code
  static async generateInviteCode(createdBy: string, expiresInHours: number = 168): Promise<{ success: boolean; message: string; code?: string }> {
    try {
      // FIXED: Generate proper RICE-SPICE format code
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let segment1 = ''
      let segment2 = ''
      
      // Generate first segment (4 characters)
      for (let i = 0; i < 4; i++) {
        segment1 += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      
      // Generate second segment (7 characters)
      for (let i = 0; i < 7; i++) {
        segment2 += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      
      const code = `RICE-SPICE-${segment1}-${segment2}`
      const expiresAt = new Date(Date.now() + (expiresInHours * 60 * 60 * 1000))
      
      const inviteCode: Omit<InviteCode, 'id'> = {
        code,
        createdBy,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        isUsed: false,
        maxUses: 1,
        currentUses: 0
      }

      const docRef = await addDoc(collection(db, 'invite-codes'), inviteCode)
      
      return { 
        success: true, 
        message: 'Invite code generated successfully', 
        code 
      }
    } catch (error) {
      console.error('Error generating invite code:', error)
      return { success: false, message: 'Failed to generate invite code' }
    }
  }

  // Validate invite code
  static async validateInviteCode(code: string): Promise<{ success: boolean; message: string }> {
    try {
      const q = query(collection(db, 'invite-codes'), where('code', '==', code))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return { success: false, message: 'Invalid invite code' }
      }

      const inviteDoc = querySnapshot.docs[0]
      const invite = inviteDoc.data() as InviteCode
      
      if (invite.isUsed && invite.currentUses >= invite.maxUses) {
        return { success: false, message: 'Invite code has already been used' }
      }

      if (new Date(invite.expiresAt) < new Date()) {
        return { success: false, message: 'Invite code has expired' }
      }

      return { success: true, message: 'Valid invite code' }
    } catch (error) {
      console.error('Error validating invite code:', error)
      return { success: false, message: 'Failed to validate invite code' }
    }
  }

  // Mark invite code as used
  static async markInviteCodeUsed(code: string, usedBy: string): Promise<void> {
    try {
      const q = query(collection(db, 'invite-codes'), where('code', '==', code))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const inviteDoc = querySnapshot.docs[0]
        const invite = inviteDoc.data() as InviteCode
        
        await updateDoc(inviteDoc.ref, {
          isUsed: invite.currentUses + 1 >= invite.maxUses,
          currentUses: invite.currentUses + 1,
          usedBy: invite.usedBy ? `${invite.usedBy}, ${usedBy}` : usedBy,
          usedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error marking invite code as used:', error)
    }
  }

  // Register admin user
  static async registerAdmin(email: string, password: string, inviteCode: string): Promise<{ success: boolean; message: string }> {
    try {
      // First validate the invite code
      const validation = await this.validateInviteCode(inviteCode)
      if (!validation.success) {
        return validation
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Check if this is the first admin (owner)
      const adminSnapshot = await getDocs(collection(db, 'admin-users'))
      const isFirstAdmin = adminSnapshot.empty

      const adminUser: AdminUser = {
        uid: user.uid,
        email: user.email!,
        role: isFirstAdmin ? 'owner' : 'manager', // First admin is owner, others are managers
        createdAt: new Date().toISOString(),
        invitedBy: inviteCode
      }

      // Save admin user to Firestore
      await setDoc(doc(db, 'admin-users', user.uid), adminUser)

      // Mark invite code as used
      await this.markInviteCodeUsed(inviteCode, user.email!)

      return { success: true, message: 'Admin account created successfully' }
    } catch (error: any) {
      console.error('Error registering admin:', error)
      let message = 'Failed to create admin account'
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists'
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters'
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address'
      }
      
      return { success: false, message }
    }
  }

  // Sign in admin user
  static async signInAdmin(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update last login
      await setDoc(doc(db, 'admin-users', user.uid), {
        lastLogin: new Date().toISOString()
      }, { merge: true })

      return { success: true, message: 'Signed in successfully' }
    } catch (error: any) {
      console.error('Error signing in:', error)
      let message = 'Failed to sign in'
      
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email'
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password'
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address'
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later'
      }
      
      return { success: false, message }
    }
  }

  // ENHANCED: Complete admin user deletion (both admin collection and Firebase Auth)
  static async deleteAdminUser(uid: string, email: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🗑️ Starting complete deletion for user: ${email} (${uid})`)
      
      // Step 1: Delete from admin-users collection (this removes admin access immediately)
      await deleteDoc(doc(db, 'admin-users', uid))
      console.log('✅ User removed from admin collection')
      
      // Step 2: Call server-side API to delete from Firebase Authentication
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, email }),
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ User deleted from Firebase Authentication')
        return { 
          success: true, 
          message: `Admin account for ${email} has been completely deleted from both admin system and Firebase Authentication` 
        }
      } else {
        console.warn('⚠️ Failed to delete from Firebase Auth, but admin access removed')
        // Mark the user as deleted in our system even if Firebase Auth deletion failed
        // This prevents orphaned admin access while still providing feedback
        return { 
          success: true, 
          message: `Admin access removed for ${email}. Note: Firebase Authentication account may need manual cleanup.` 
        }
      }
    } catch (error) {
      console.error('❌ Error during user deletion:', error)
      return { 
        success: false, 
        message: 'Failed to delete user account. Please try again.' 
      }
    }
  }

  // Sign out admin user
  static async signOutAdmin(): Promise<{ success: boolean; message: string }> {
    try {
      await signOut(auth)
      return { success: true, message: 'Signed out successfully' }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, message: 'Failed to sign out' }
    }
  }

  // Get current admin user
  static async getCurrentAdmin(): Promise<AdminUser | null> {
    try {
      const user = auth.currentUser
      if (!user) return null

      const docRef = doc(db, 'admin-users', user.uid)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) return null
      
      return docSnap.data() as AdminUser
    } catch (error) {
      console.error('Error getting current admin:', error)
      return null
    }
  }

  // Get all invite codes
  static async getInviteCodes(): Promise<InviteCode[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'invite-codes'))
      const codes: InviteCode[] = []
      
      querySnapshot.forEach((doc) => {
        codes.push({ ...doc.data(), id: doc.id } as InviteCode)
      })
      
      return codes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (error) {
      console.error('Error getting invite codes:', error)
      return []
    }
  }

  // Delete expired invite codes
  static async cleanupExpiredCodes(): Promise<number> {
    try {
      const now = new Date()
      const querySnapshot = await getDocs(collection(db, 'invite-codes'))
      let deletedCount = 0
      
      for (const docSnap of querySnapshot.docs) {
        const code = docSnap.data() as InviteCode
        if (new Date(code.expiresAt) < now) {
          await deleteDoc(doc(db, 'invite-codes', code.id))
          deletedCount++
        }
      }
      
      return deletedCount
    } catch (error) {
      console.error('Error cleaning up expired codes:', error)
      return 0
    }
  }

  // NEW: Delete specific invite code
  static async deleteInviteCode(codeId: string): Promise<{ success: boolean; message: string }> {
    try {
      await deleteDoc(doc(db, 'invite-codes', codeId))
      return { success: true, message: 'Invite code deleted successfully' }
    } catch (error) {
      console.error('Error deleting invite code:', error)
      return { success: false, message: 'Failed to delete invite code' }
    }
  }

  // Send password reset email
  static async sendPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true, message: 'Password reset email sent' }
    } catch (error: any) {
      console.error('Error sending password reset:', error)
      let message = 'Failed to send password reset email'
      
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email'
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address'
      }
      
      return { success: false, message }
    }
  }

  // Auth state listener
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback)
  }

  // Initialize first admin (run once)
  static async initializeFirstAdmin(): Promise<{ success: boolean; message: string; inviteCode?: string }> {
    try {
      // Check if any admin users exist
      const adminSnapshot = await getDocs(collection(db, 'admin-users'))
      
      if (adminSnapshot.empty) {
        // No admins exist, create first invite code
        const result = await this.generateInviteCode('system')
        
        if (result.success) {
          return {
            success: true,
            message: 'First admin invite code generated. Use this to create your admin account.',
            inviteCode: result.code
          }
        } else {
          return { success: false, message: 'Failed to generate first admin invite code' }
        }
      } else {
        return { success: true, message: 'Admin system already initialized' }
      }
    } catch (error) {
      console.error('Error initializing first admin:', error)
      return { success: false, message: 'Failed to initialize admin system' }
    }
  }

  // Helper method to generate random codes (REMOVED - now using inline generation)
  // private static generateRandomCode(): string {
  //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  //   let result = ''
  //   for (let i = 0; i < 8; i++) {
  //     result += chars.charAt(Math.floor(Math.random() * chars.length))
  //   }
  //   return result
  // }
}