import { Loader } from '@/components/atoms/ui/loader'

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-primary">
      <Loader className="text-white [&>svg]:size-10!" />
    </div>
  )
}

export default Loading
