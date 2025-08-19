import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { length = 12, includeUppercase = true, includeNumbers = true, includeSymbols = true } = body;

    // Validate input
    if (length < 4 || length > 64) {
      return NextResponse.json(
        { error: 'Password length must be between 4 and 64 characters' },
        { status: 400 }
      );
    }

    // Build Python command arguments
    const args = [
      'generate.py',
      '-l', length.toString(),
      ...(includeUppercase ? [] : ['--no-upper']),
      ...(includeNumbers ? [] : ['--no-digits']),
      ...(includeSymbols ? [] : ['--no-special']),
      '-n', '1'
    ];

    return new Promise((resolve) => {
      execFile('python', args, (error, stdout, stderr) => {
        if (error) {
          console.error(`Password generation failed: ${stderr}`);
          resolve(NextResponse.json(
            { error: 'Failed to generate password' },
            { status: 500 }
          ));
        } else {
          const password = stdout.trim();
          if (!password) {
            resolve(NextResponse.json(
              { error: 'Received empty password from generator' },
              { status: 500 }
            ));
          } else {
            resolve(NextResponse.json({
              password,
              length: password.length,
              parameters: { length, includeUppercase, includeNumbers, includeSymbols }
            }));
          }
        }
      });
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  let strength = 0;
  
  // Length contributes to strength
  strength += Math.min(password.length / 4, 25);
  
  // Character variety
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
  
  // Bonus for length over 12
  if (password.length > 12) strength += 10;
  
  return Math.min(strength, 100);
}