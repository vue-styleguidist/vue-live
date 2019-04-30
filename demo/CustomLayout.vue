<template functional>
  <table class="container">
    <tr>
      <td>
        <slot name="editor"></slot>
      </td>
      <td>
        <slot name="preview"></slot>
      </td>
    </tr>
  </table>
</template>
<style>
.container {
  margin: 20px auto;
  border: 1px solid #ccc;
}

.container td {
  width: 475px;
}
</style>