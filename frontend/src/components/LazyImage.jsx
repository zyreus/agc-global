export default function LazyImage({ className = '', alt = '', decoding = 'async', loading = 'lazy', ...props }) {
  return <img className={className} alt={alt} loading={loading} decoding={decoding} {...props} />
}
