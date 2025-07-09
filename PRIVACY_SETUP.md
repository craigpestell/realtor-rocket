# Privacy Policy and Legal Pages Setup

This document outlines the privacy policy and legal pages created for Realtor Rocket to comply with Google Cloud Vision API requirements and general privacy regulations.

## Pages Created

### 1. Privacy Policy (`/privacy`)
- **URL**: https://your-domain.com/privacy
- **Purpose**: Complies with GDPR, CCPA, and Google's privacy requirements
- **Key Sections**:
  - Data collection practices
  - Google Cloud Vision API usage
  - OpenAI API integration
  - Data retention policies
  - User rights and contact information

### 2. Terms of Service (`/terms`)
- **URL**: https://your-domain.com/terms
- **Purpose**: Legal terms for using the Realtor Rocket service
- **Key Sections**:
  - Service description
  - User responsibilities
  - Intellectual property
  - Limitations and disclaimers

### 3. Contact Page (`/contact`)
- **URL**: https://your-domain.com/contact
- **Purpose**: Provides contact information for privacy concerns and general support
- **Features**:
  - Contact details
  - Business hours
  - Links to privacy policy and terms

## Google Cloud Vision API Compliance

The privacy policy specifically addresses:
- ✅ How images are processed using Google Cloud Vision API
- ✅ Data retention policies (images deleted after processing)
- ✅ Third-party service integration disclosures
- ✅ User rights and contact information
- ✅ International data transfer notices

## Next Steps

1. **Update Contact Information**: Replace placeholder contact details in:
   - `/src/app/privacy/page.tsx`
   - `/src/app/terms/page.tsx`
   - `/src/app/contact/page.tsx`

2. **Update Domain**: Replace `https://realtor-rocket.com` with your actual domain in:
   - `/src/app/sitemap.ts`
   - `/src/app/robots.ts`

3. **Legal Review**: Have a legal professional review the privacy policy and terms of service for your specific jurisdiction and use case.

4. **Google Cloud Console**: When setting up Google Cloud Vision API, provide the privacy policy URL: `https://your-domain.com/privacy`

## Footer Links

The footer now includes links to:
- Privacy Policy
- Terms of Service
- Contact page

## SEO and Discoverability

Created files for better search engine optimization:
- `sitemap.ts` - Generates XML sitemap
- `robots.ts` - Generates robots.txt file
- Updated metadata in `layout.tsx`

## Privacy Policy URL for Google

When configuring Google Cloud Vision API, use this URL for your privacy policy:
```
https://your-domain.com/privacy
```

This URL should be publicly accessible and clearly explain how you handle user data and integrate with Google's services.
