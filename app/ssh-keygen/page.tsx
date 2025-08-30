import {SSHKeygen} from "@/app/ssh-keygen/components";
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'SSH Keygen',
  description: 'Generate Ed25519 SSH key pairs for secure authentication.',
}

export default function SSHKeygenPage() {
  return <SSHKeygen/>
}
