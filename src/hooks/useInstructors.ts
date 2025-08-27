import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Instructor } from '@/components/exam-scheduler/types';
import { toast } from '@/hooks/use-toast';

export function useInstructors() {
  return useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Instructor[];
    },
  });
}

export function useAddInstructor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (instructor: Omit<Instructor, 'id'>) => {
      const { data, error } = await supabase
        .from('instructors')
        .insert([instructor])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast({
        title: 'Success',
        description: 'Instructor added successfully',
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

export function useDeleteInstructor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('instructors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast({
        title: 'Success',
        description: 'Instructor deleted successfully',
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