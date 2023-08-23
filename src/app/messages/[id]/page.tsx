import Conversation from '@/components/Conversation'
import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

type Props = { params: { id: string } }

export default async function Message({ params }: Props) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const { data: profiles } = await supabase.from('profiles').select('*')
  const { data: chat } = await supabase
    .from('chats')
    .select('*')
    .eq('chat_id', params.id)
    .single()
  const { data: messages } = await supabase
    .from('messages')
    .select()
    .eq('chat_id', params.id)

  const usersInChat = profiles?.filter(user => chat?.users.includes(user.id))

  return (
    <Conversation
      chatId={params.id}
      users={usersInChat ?? []}
      messages={messages ?? []}
    />
  )
}
