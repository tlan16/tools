import type {Metadata} from 'next'


import {BasicAuth} from "@/app/basic-auth/components";

export const metadata: Metadata = {
  title: 'Basic Auth Generator',
  description: 'Generate basic authentication credentials with customizable options.',
}

export default function BasicAuthPage() {
  return <BasicAuth/>
}
