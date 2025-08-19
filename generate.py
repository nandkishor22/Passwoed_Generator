import random
import argparse
import sys

def generate_password(length=12, use_upper=True, use_digits=True, use_special=True):
    """Generate a random password with customizable complexity"""
    lowercase = 'abcdefghijklmnopqrstuvwxyz'
    uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' if use_upper else ''
    digits = '0123456789' if use_digits else ''
    special = '!@#$%^&*()_+-=[]{}|;:,.<>?' if use_special else ''
    
    all_chars = lowercase + uppercase + digits + special
    if not all_chars:
        raise ValueError("At least one character set must be enabled")
    
    return ''.join(random.SystemRandom().choice(all_chars) for _ in range(length))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate secure passwords')
    parser.add_argument('-l', '--length', type=int, default=12, 
                       help='Password length (default: 12)')
    parser.add_argument('--no-upper', action='store_false', dest='use_upper',
                       help='Exclude uppercase letters')
    parser.add_argument('--no-digits', action='store_false', dest='use_digits',
                       help='Exclude digits')
    parser.add_argument('--no-special', action='store_false', dest='use_special',
                       help='Exclude special characters')
    parser.add_argument('-n', '--count', type=int, default=1,
                       help='Number of passwords to generate')

    args = parser.parse_args()
    
    try:
        for _ in range(args.count):
            print(generate_password(
                length=args.length,
                use_upper=args.use_upper,
                use_digits=args.use_digits,
                use_special=args.use_special
            ))
    except ValueError as e:
        print(f"Error: {str(e)}")
        sys.exit(1)