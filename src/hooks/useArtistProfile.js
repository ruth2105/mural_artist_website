import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { artistInfo as staticArtistInfo } from '../data/artist';

export function useArtistProfile() {
  const [profile, setProfile] = useState(staticArtistInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      if (!supabase) {
        setProfile(staticArtistInfo);
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('artist_profile')
        .select('*')
        .single();

      const { data: contactData, error: contactError } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (profileError || contactError) {
        console.log('Using static artist data');
        setProfile(staticArtistInfo);
        setLoading(false);
        return;
      }

      // Merge database data with static structure
      const mergedProfile = {
        name: profileData?.name || staticArtistInfo.name,
        tagline: profileData?.tagline || staticArtistInfo.tagline,
        profileImage: profileData?.profile_image_url || staticArtistInfo.profileImage,
        biography: profileData?.biography || staticArtistInfo.biography,
        skills: profileData?.skills || staticArtistInfo.skills,
        contact: {
          email: contactData?.email || staticArtistInfo.contact.email,
          emailLink: `mailto:${contactData?.email || staticArtistInfo.contact.email}`,
          phone: contactData?.phone || staticArtistInfo.contact.phone,
          phoneRaw: contactData?.phone?.replace(/[^0-9]/g, '') || staticArtistInfo.contact.phoneRaw,
          phoneLink: `tel:${contactData?.phone?.replace(/[^0-9+]/g, '') || staticArtistInfo.contact.phoneLink}`,
          tiktok: contactData?.tiktok_url || staticArtistInfo.contact.tiktok,
          instagram: contactData?.instagram_url || staticArtistInfo.contact.instagram,
          telegram: contactData?.telegram_url || staticArtistInfo.contact.telegram,
          youtube: contactData?.youtube_url || staticArtistInfo.contact.youtube,
          instagramHandle: contactData?.instagram_handle || staticArtistInfo.contact.instagramHandle,
          tiktokHandle: contactData?.tiktok_handle || staticArtistInfo.contact.tiktokHandle,
          youtubeHandle: contactData?.youtube_handle || staticArtistInfo.contact.youtubeHandle
        }
      };

      setProfile(mergedProfile);
      setLoading(false);

    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(staticArtistInfo);
      setLoading(false);
    }
  }

  return { profile, loading };
}
