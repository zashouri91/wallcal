import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const settingsSchema = z.object({
  icalUrl: z.string().url('Please enter a valid iCal URL'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsMenuProps {
  onIcalConnect: (url: string) => void;
}

export function SettingsMenu({ onIcalConnect }: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      icalUrl: '',
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      // In a real app, you would validate the iCal URL and fetch the calendar data
      await onIcalConnect(data.icalUrl);
      toast({
        title: 'Calendar Connected',
        description: 'Your iCal calendar has been successfully connected.',
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to the iCal calendar. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-gray-100"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Calendar Settings</DialogTitle>
            <DialogDescription>
              Connect your Apple iCal calendar to sync events
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="icalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>iCal URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://calendar.google.com/calendar/ical/..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your iCal calendar URL. You can find this in your Calendar app settings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Connect Calendar</Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-medium mb-2">How to get your iCal URL:</h4>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li>1. Open Calendar app on your Mac</li>
              <li>2. Right-click on the calendar you want to share</li>
              <li>3. Select "Share Calendar..."</li>
              <li>4. Check "Public Calendar"</li>
              <li>5. Copy the Calendar URL</li>
            </ol>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}