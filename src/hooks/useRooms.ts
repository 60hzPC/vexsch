import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Room } from '@/components/exam-scheduler/types';
import { toast } from '@/hooks/use-toast';

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Room[];
    },
  });
}

export function useAddRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (room: Omit<Room, 'id'>) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert([room])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: 'Success',
        description: 'Room added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: 'Success',
        description: 'Room deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}