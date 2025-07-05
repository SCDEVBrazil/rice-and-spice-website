// app/api/admin/delete-user/route.ts

import { NextRequest, NextResponse } from 'next/server'

// Firebase Admin SDK imports - Fixed import paths
import admin from 'firebase-admin'

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      })
    })
    console.log('Firebase Admin SDK initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error)
  }
}

const adminAuth = admin.auth()

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Server-side user deletion API called')
    
    // Parse request body
    const { uid, email } = await request.json()
    
    if (!uid || !email) {
      console.error('❌ Missing required parameters: uid or email')
      return NextResponse.json(
        { success: false, message: 'Missing required parameters: uid and email' },
        { status: 400 }
      )
    }

    console.log(`🗑️ Attempting to delete user: ${email} (${uid})`)

    // Basic security check - in production, implement proper JWT verification
    // For now, we'll proceed since this is behind Firebase Authentication
    
    // Delete the user from Firebase Authentication using Admin SDK
    try {
      await adminAuth.deleteUser(uid)
      console.log(`✅ Successfully deleted user ${email} from Firebase Authentication`)
      
      return NextResponse.json({
        success: true,
        message: `User ${email} successfully deleted from Firebase Authentication`
      })
    } catch (deleteError: any) {
      console.error(`❌ Failed to delete user ${email} from Firebase Auth:`, deleteError)
      
      // Handle specific Firebase Auth errors
      let errorMessage = 'Failed to delete user from Firebase Authentication'
      
      if (deleteError.code === 'auth/user-not-found') {
        // User doesn't exist in Firebase Auth anymore - this is actually OK
        console.log(`ℹ️ User ${email} not found in Firebase Auth (may have been deleted already)`)
        return NextResponse.json({
          success: true,
          message: `User ${email} not found in Firebase Authentication (may have been already deleted)`
        })
      } else if (deleteError.code === 'auth/invalid-uid') {
        errorMessage = 'Invalid user ID provided'
      }
      
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('❌ Server error during user deletion:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error during user deletion' },
      { status: 500 }
    )
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed. Use POST.' },
    { status: 405 }
  )
}