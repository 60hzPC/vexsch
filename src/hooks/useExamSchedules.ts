import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScheduleData } from '@/components/exam-scheduler/types';
import { toast } from '@/hooks/use-toast';

interface ExamSchedule {
  id: string;
  name: string;
  schedule_data: any;
  stats: any;
  created_at: string;
  updated_at: string;
}

export function useExamSchedules() {
  return useQuery({
    queryKey: ['exam_schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exam_schedules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(item => ({
        ...item,
        schedule_data: item.schedule_data as any
      })) as ExamSchedule[];
    },
  });
}

export function useSaveExamSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, schedule_data, stats }: { name: string; schedule_data: ScheduleData; stats: any }) => {
      const { data, error } = await supabase
        .from('exam_schedules')
        .insert([{ name, schedule_data: schedule_data as any, stats }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam_schedules'] });
      toast({
        title: 'Success',
        description: 'Schedule saved successfully',
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

export function useDeleteExamSchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('exam_schedules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam_schedules'] });
      toast({
        title: 'Success',
        description: 'Schedule deleted successfully',
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