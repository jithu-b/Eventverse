"""Supabase Automated Backups Configuration"""

BACKUP_INSTRUCTIONS = """
🔒 ENABLE AUTOMATED BACKUPS IN SUPABASE:

1. Go to https://app.supabase.com
2. Select your EventVerse project
3. Click Settings > Database > Backups
4. Enable "Automated Backups"
5. Set:
   - Frequency: Daily
   - Time: 02:00 UTC
   - Retention: 30 days
   - Email notifications: Enabled
6. Backups will be created automatically!

RESTORE FROM BACKUP:
- Backups tab > Select backup > Restore
- Data will be restored to chosen point in time
"""

def get_backup_status():
    return {
        "backups_enabled": True,
        "frequency": "Daily",
        "retention_days": 30,
        "status": "Check Supabase Dashboard",
        "docs": "https://supabase.com/docs/guides/database/backups"
    }
