function InputField({ id, label, type = 'text', placeholder }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        className="w-full cursor-text rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-950 outline-none transition duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </label>
  )
}

export default InputField
