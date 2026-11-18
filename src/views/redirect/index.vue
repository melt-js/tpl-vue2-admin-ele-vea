<script>
export default {
  name: 'Redirect',
  beforeCreate() {
    const { params, query, hash } = this.$route
    this.$router.replace({ path: '/' + params.path, query, hash })
  },
  render(h) { return h() }
}
</script>
