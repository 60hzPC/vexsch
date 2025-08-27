import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/components/exam-scheduler/types';
import { toast } from '@/hooks/use-toast';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Course[];
    },
  });
}

export function useAddCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (course: Omit<Course, 'id'>) => {
      const { data, error } = await supabase
        .from('courses')
        .insert([course])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: 'Success',
        description: 'Course added successfully',
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

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: 'Success',
        description: 'Course deleted successfully',
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