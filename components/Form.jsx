import Link from 'next/link';

const Form = ({type, task, setTask, submitting, handleSubmit}) => {
  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <p className='desc max-w-md text-left'>
        {type} tasks and lets plan your tasks efficiently with task managing tools.
      </p>

      <form 
        onSubmit={handleSubmit}
        className='mt-10 w-full max-w-2x1 flex flex-col gap-7'
      >
        <label>
          <span className='font-semibold text-base text-gray-700'>
            Your Task
          </span>
        </label>

        <textarea
          value={task.text}
          onChange={(e) => setTask({...task, text: e.target.value})}
          placeholder='Write your task here'
          required
          className='font-medium bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-base text-gray-700 px-5 py-3 resize-none block w-full'
        />

      <div className='flex-end mx-3 mb-5 gap-4'>
        <Link href="/" className='text-gray-500 text-sm'>
          Cancel
        </Link>

        <button type='submit' disabled={submitting} className='px-5 py-1.5 text-sm bg-orange-400 rounded-full text-white ml-2'>
          {submitting ? `${type}...` : type}
        </button>
      </div>
      </form>
    </section>
  )
}

export default Form
