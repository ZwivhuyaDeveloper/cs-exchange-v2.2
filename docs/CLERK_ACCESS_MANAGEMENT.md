# Managing User Access in Clerk Dashboard

This document outlines how to manage user access to protected routes in the CS Exchange v2.2 application using the Clerk Dashboard.

## Access Control Overview

The application uses Clerk's user metadata to control access to protected routes:

- `canAccessResearch`: Grants access to the Research section
- `canAccessSignals`: Grants access to the Signals section

These permissions are stored in the user's `publicMetadata` or `unsafeMetadata` in Clerk.

## Managing User Permissions

### For Individual Users

1. Log in to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Users** in the sidebar
3. Click on the user you want to modify
4. Go to the **Metadata** tab
5. Under **Public Metadata** or **Unsafe Metadata**, add or modify the following fields:
   ```json
   {
     "canAccessResearch": true,
     "canAccessSignals": true
   }
   ```
6. Click **Save Changes**

### For Multiple Users (Bulk Update)

1. Go to **Users** in the sidebar
2. Select multiple users using the checkboxes
3. Click **Bulk Actions** and select **Update metadata**
4. Add or modify the permission fields as needed
5. Click **Update Users**

## Testing Access

1. Log out of the application
2. Try to access a protected route (e.g., `/research` or `/signals`)
3. You should be redirected to the sign-in page if not authenticated
4. After signing in, you'll either:
   - See the protected content if you have permission
   - Be redirected to the `/unauthorized` page if you don't have permission

## Troubleshooting

- **Permission Denied?** Ensure the user has the correct metadata set in Clerk
- **Not Redirecting?** Clear your browser cache and cookies
- **Still Having Issues?** Check the browser's console for any errors

## Security Notes

- Only grant access to trusted users
- Regularly review and audit user permissions
- Use the most restrictive permissions necessary for each user's role

For more information, refer to the [Clerk Documentation](https://clerk.com/docs).
