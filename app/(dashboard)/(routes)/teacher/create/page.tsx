"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import axios from "axios";
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title Is Required.",
  })
})

const CreatePage = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    }
  })

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values)
      router.push(`/teacher/courses/${response.data.id}`)
      toast.success("Course Created!")
    } catch {
      toast.error("Something Went Wrong")
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">
          Name Your Course
        </h1>
        <p className="text-sm text-slate-600">
          What Would You Like To Name Your Course, You Can Change It Later If You Want...
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField control={form.control} name="title" render= {({ field }) => (
              <FormItem>
                <FormLabel>
                  Course Title
                </FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder="e.g. 'ThreeJS Development'" {...field} />
                </FormControl>
                <FormDescription>
                  What Will You Teach In This Course?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex items-center gap-x-2">
              <Link href="/" >
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </Link>   
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue  
              </Button>           
            </div>            
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreatePage
