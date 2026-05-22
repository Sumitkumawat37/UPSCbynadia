import React, { useState } from 'react';
import { HardDrive, FileText, RefreshCw, Plus, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateNote } from '@/lib/supabase-mutations';
import { useCourses, useChapters } from '@/lib/supabase-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export const DriveNotesIntegration = () => {
  const createNote = useCreateNote();
  const { data: courses = [] } = useCourses();
  const { data: chapters = [] } = useChapters();
  
  const [driveUrl, setDriveUrl] = useState<string>('');
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteDesc, setNoteDesc] = useState<string>('');
  const [notePages, setNotePages] = useState<string>('');
  const [noteCourseId, setNoteCourseId] = useState<string>('');
  const [noteChapterId, setNoteChapterId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const extractFileId = (url: string): string | null => {
    try {
      const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (dMatch) return dMatch[1];
      
      const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (openMatch) return openMatch[1];
      
      return null;
    } catch (e) {
      return null;
    }
  };

  const handleUploadFromDrive = async () => {
    setLoading(true);
    setError(null);
    
    if (!driveUrl) {
      setError('Please enter a Google Drive file URL');
      setLoading(false);
      return;
    }

    if (!noteTitle || !noteCourseId || !noteChapterId) {
      setError('Please fill in title, course, and chapter');
      setLoading(false);
      return;
    }

    const fileId = extractFileId(driveUrl);
    if (!fileId) {
      setError('Invalid Google Drive file URL. Please provide a valid file link.');
      setLoading(false);
      return;
    }

    // Create note with Drive URL
    createNote.mutate({
      course_id: noteCourseId,
      chapter_id: noteChapterId,
      title: noteTitle,
      description: noteDesc,
      file_url: driveUrl,
      pages: parseInt(notePages) || 0,
    }, {
      onSuccess: () => {
        toast.success('Note uploaded from Drive successfully!');
        setDriveUrl('');
        setNoteTitle('');
        setNoteDesc('');
        setNotePages('');
        setNoteCourseId('');
        setNoteChapterId('');
        setLoading(false);
      },
      onError: (error: any) => {
        setError(error.message || 'Failed to upload note');
        setLoading(false);
      },
    });
  };

  const filteredChapters = chapters.filter((c) => c.course_id === noteCourseId);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">Upload Notes from Drive</h3>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-gray-400 text-xs mb-2 block">Course *</Label>
          <Select value={noteCourseId} onValueChange={(v) => { setNoteCourseId(v); setNoteChapterId(''); }}>
            <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
            <SelectContent>{courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.thumbnail_emoji} {c.title}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {noteCourseId && (
          <div>
            <Label className="text-gray-400 text-xs mb-2 block">Chapter *</Label>
            <Select value={noteChapterId} onValueChange={setNoteChapterId}>
              <SelectTrigger><SelectValue placeholder="Select chapter" /></SelectTrigger>
              <SelectContent>{filteredChapters.map((ch) => <SelectItem key={ch.id} value={ch.id}>{ch.title}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label className="text-gray-400 text-xs mb-2 block">Note Title *</Label>
          <Input placeholder="e.g. Chapter 1 Notes" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
        </div>

        <div>
          <Label className="text-gray-400 text-xs mb-2 block">Description</Label>
          <Textarea placeholder="Brief description..." rows={2} value={noteDesc} onChange={(e) => setNoteDesc(e.target.value)} />
        </div>

        <div>
          <Label className="text-gray-400 text-xs mb-2 block">Pages</Label>
          <Input type="number" placeholder="10" value={notePages} onChange={(e) => setNotePages(e.target.value)} />
        </div>

        <div>
          <Label className="text-gray-400 text-xs mb-2 block">Google Drive File URL *</Label>
          <input
            type="text"
            value={driveUrl}
            onChange={(e) => setDriveUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleUploadFromDrive}
          disabled={loading || createNote.isPending}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          {loading || createNote.isPending ? <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading...</> : <><ExternalLink className="w-4 h-4" /> Upload from Drive</>}
        </button>

        <p className="text-gray-500 text-xs text-center">
          Paste a Google Drive file link to upload it as a note for students
        </p>
      </div>
    </div>
  );
};
