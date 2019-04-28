<template functional>
  <div class="preview-code" style="display:flex;">
    <div style="flex-grow:1;">
      <slot name="editor"></slot>
    </div>
    <div style="flex-grow:1;">
      <slot name="preview"></slot>
    </div>
  </div>
</template>