import React from 'react';
import { useEditorContent } from '../hooks/useEditorContent';
import type { Descendant } from 'slate';
import { useState } from 'react';
import supabase from '../utils/supabase';
import renderNode, { type RichElement } from '../utils/previewRenderer'

// rendering helpers moved to src/utils/previewRenderer.tsx

const EditPreview: React.FC = () => {
  const { content } = useEditorContent();

  // Form state
  const [topic, setTopic] = useState<string>('')
  const [topicNumber, setTopicNumber] = useState<number | ''>('')
  const [grade, setGrade] = useState<string>('')
  const [noteType, setNoteType] = useState<string>('Notes')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [subject, setSubject] = useState<string>('Mathematics')

  const uploadImage = async (input: any): Promise<string> => {
    // input can be a File, a data URL string, or already a remote URL string
    if (!input) return ''

    // If already a remote URL, return as-is
    if (typeof input === 'string' && (input.startsWith('http://') || input.startsWith('https://'))) {
      return input
    }

    // Create a File object if input is a data URL
    let file: File | null = null
    if (typeof input === 'string' && input.startsWith('data:')) {
      const res = await fetch(input)
      const blob = await res.blob()
      const ext = blob.type.split('/')?.[1] ?? 'png'
      file = new File([blob], `${Date.now()}.${ext}`, { type: blob.type })
    } else if (input instanceof File) {
      file = input
    } else if (typeof input === 'object' && 'name' in input && 'size' in input) {
      // might already be a File-like object
      file = input as File
    }

    if (!file) {
      // fallback: return empty string
      return ''
    }

    const path = `notes/${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('notes_bucket').upload(path, file, { upsert: true })
    if (uploadError) {
      throw uploadError
    }
    const { data } = supabase.storage.from('notes_bucket').getPublicUrl(path)
    return data.publicUrl
  }

  const handleNotesSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setErrorMsg(null)
    setLoading(true)
    try {
      // Find image nodes and upload images, replacing urls with public urls
      const contentCopy: Descendant[] = JSON.parse(JSON.stringify(content || []))
      const uploadedImages: string[] = []

      const walkAndUpload = async (nodes: Descendant[]) => {
        for (const node of nodes) {
          const elem = node as RichElement
          if ((elem.type ?? '') === 'image') {
            const url = (elem as any).url
            if (url) {
              const publicUrl = await uploadImage(url)
              if (publicUrl) {
                (elem as any).url = publicUrl
                uploadedImages.push(publicUrl)
              }
            }
          }
          // Recurse into children if present
          if ((elem.children ?? []).length > 0) {
            await walkAndUpload(elem.children as Descendant[])
          }
        }
      }

      await walkAndUpload(contentCopy)

      // Insert record into `notes` table (assumption: table is named 'notes')
      const insertPayload = {
        topic,
        topic_number: typeof topicNumber === 'number' ? topicNumber : null,
        subject,
        grade,
        type: noteType,
        content: contentCopy, // store as JSON/JSONB in Supabase
        images: uploadedImages,
      }

      const { data: insertData, error: insertError } = await supabase.from('notes').insert(insertPayload).select()
      if (insertError) throw insertError
      console.log('Inserted note', insertData)
      // optionally reset form
      setTopic('')
      setTopicNumber('')
      setSubject('Mathematics')
      setGrade('')
      setNoteType('Notes')

    } catch (err: any) {
      console.error('Publish failed', err)
      setErrorMsg(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className='max-w-2xl mx-auto bg-white rounded shadow-sm p-6 mt-4'>
            {content && content.length > 0 ? (
              content.map((node: Descendant, i: number) => (
                <React.Fragment key={i}>{renderNode(node, i)}</React.Fragment>
              ))
        ) : (
          <div className="text-sm text-gray-500">No content to preview.</div>
        )}
        <div className='border border-green-500'></div>

        <div className='text-black text-[0.675rem] mt-3'>
          {
            content && content.length > 0 ? (
              <div >
                <form onSubmit={handleNotesSubmit} className='flex flex-col gap-2 items-center justify-between'>
                <label htmlFor="topic" className='text-sm'>
                    Topic
                </label>
        <input 
                    id='topic' 
                    type="text" 
          className='border-2 border-gray-400/50 rounded-sm placeholder:text-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm text-black/90 w-full'
                    placeholder='E.g., Thermodymanics'
          aria-required="true"
          required
          value={topic}
          onChange={e => setTopic(e.target.value)}
                />
                <label htmlFor="topic-number" className='text-sm'>
                    Topic Number according to the syllabus
                </label>
                <input 
                    id='topic-number' 
                    type="number" 
                    className='border-2 border-gray-400/50 rounded-sm placeholder:text-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm text-black/90 w-full'
                    aria-required="true"
                    required
                    value={topicNumber}
                    onChange={e => setTopicNumber(e.target.value === '' ? '' : Number(e.target.value))}
                />
                  <select required name="subject" id="subject" className='p-2 outline-green-500' value={subject} onChange={e => setSubject(e.target.value)}>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Integrated Science">Integrated Science</option>
                  </select>
                  <select required name="grade" id="grade" className='p-2 outline-green-500' value={grade} onChange={e => setGrade(e.target.value)}>
                    <option value="" disabled selected>Select Form</option>
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                    <option value="Form 5">Form 5</option>
                    <option value="Form 6">Form 6</option>
                  </select>
                  <select name="noteType" id="noteType" className='p-2 outline-green-500' value={noteType} onChange={e => setNoteType(e.target.value)}>
                    <option value="Notes">Notes</option>
                    <option value="Exercises">Exercises</option>
                  </select>
                  <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                      type='submit'
                      disabled={loading}
                  >{loading ? 'Publishing...' : 'Publish'}</button>
                  {errorMsg ? <div className='text-sm text-red-600 mt-2'>We had a problem uploading the content </div> : null}
                </form>
              </div>
            ): ""
          }
        </div>
      </div>
    </div>
  );
};

export default EditPreview;