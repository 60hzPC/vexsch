import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Program } from '@/components/exam-scheduler/types';
import { toast } from '@/hooks/use-toast';

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Program[];
    },
  });
}

export function useAddProgram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (program: Omit<Program, 'id'>) => {
      const { data, error } = await supabase
        .from('programs')
        .insert([program])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast({
        title: 'Success',
        description: 'Program added successfully',
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

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast({
        title: 'Success',
        description: 'Program deleted successfully',
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