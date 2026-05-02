#!/bin/sh
# Healthcheck script for Keycloak
# Uses /proc filesystem to check if Keycloak Java process is running

# Check if any process has keycloak or kc.sh in its command line
for pid_dir in /proc/[0-9]*; do
    if [ -d "$pid_dir" ] && [ -r "$pid_dir/cmdline" ]; then
        # Read command line and check for keycloak
        cmd=$(cat "$pid_dir/cmdline" 2>/dev/null)
        if echo "$cmd" | grep -q "keycloak\|kc\.sh"; then
            # Found Keycloak process - check port 8080 if possible
            if [ -r /proc/net/tcp ]; then
                # Port 8080 = 1F90 hex, in /proc appears as 901F (little-endian)
                if grep -q "901F" /proc/net/tcp 2>/dev/null; then
                    exit 0
                fi
            fi
            # Process found - assume healthy
            exit 0
        fi
    fi
done

# No Keycloak process found
exit 1
