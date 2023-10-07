"use client"

import * as z from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { ImageIcon, Pencil, PlusCircle, VideoIcon } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Chapter, Course, MuxData } from "@prisma/client"
import Image from "next/image"
import { FileUpload } from "@/components/file-upload"
import MuxPlayer from "@mux/mux-player-react"

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData: MuxData | null },
    courseId: string,
    chapterId: string
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
})

export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => setIsEditing((current) => !current)

    const router = useRouter()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter Updated")
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error("Something Went Wrong!")
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium items-center flex justify-between">
                Chapter Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add A Video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <VideoIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload endpoint="chapterVideo" onChange={(url) => {
                        if (url) {
                            onSubmit({ videoUrl: url })
                        }
                    }} />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload This Chapter&apos;s Video
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Video Can Take A Few Minute To Process. Refresh The Page If Video Does Not Appear.
                </div>
            )}
        </div>
    )
}