import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email dan password wajib diisi' }, { status: 400 })
    }

    // Cek data pendaftaran dari cookie (jika ada)
    const mockUserDataCookie = request.cookies.get('mock_user_data')?.value
    let registeredUser = null

    if (mockUserDataCookie) {
      try {
        registeredUser = JSON.parse(mockUserDataCookie)
      } catch (err) {
        console.error('Gagal memproses cookie mock_user_data:', err)
      }
    }

    // Skenario 1: Jika ada user terdaftar di cookie dan kredensial cocok
    if (registeredUser && registeredUser.email === email && registeredUser.password === password) {
      return NextResponse.json({
        success: true,
        user: {
          id: 'mock-registered-id',
          email: registeredUser.email,
          name: registeredUser.name,
          role: 'STUDENT',
          accountComplete: registeredUser.accountComplete ?? false,
          tier: registeredUser.tier || 'univ'
        },
        token: 'mock-jwt-token-registered'
      })
    }

    // Skenario 2: Kredensial default (fallback)
    if (email === 'student@oneacademy.id' && password === 'password123') {
      return NextResponse.json({
        success: true,
        user: {
          id: 'mock-student-id',
          email: 'student@oneacademy.id',
          name: 'Siswa Teladan',
          role: 'STUDENT',
          accountComplete: true,
          tier: 'univ'
        },
        token: 'mock-jwt-token-default'
      })
    }

    // Skenario 3: Kredensial salah
    return NextResponse.json({ success: false, error: 'Email atau password salah' }, { status: 401 })
  } catch (error) {
    console.error('Mock Login API Error:', error)

    return NextResponse.json({ success: false, error: 'Terjadi kesalahan internal' }, { status: 500 })
  }
}
