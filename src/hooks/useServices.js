import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { services as staticServices } from '../data/services';

export function useServices() {
  const [services, setServices] = useState(staticServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      if (!supabase) {
        setServices(staticServices);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        console.log('Using static services data');
        setServices(staticServices);
        setLoading(false);
        return;
      }

      // Transform database format to match static format
      const transformed = data.map(service => ({
        id: service.service_number,
        title: service.title,
        description: service.description,
        features: service.features || []
      }));

      setServices(transformed);
      setLoading(false);

    } catch (err) {
      console.error('Error fetching services:', err);
      setServices(staticServices);
      setLoading(false);
    }
  }

  return { services, loading };
}
