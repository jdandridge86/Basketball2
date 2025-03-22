<script setup>
    import Logo from './Logo.vue'
</script>

<template>
    <header class="padding-block-700">
        <div class="container spread">
            <Logo />
            <slot></slot>
        </div>
    </header>
</template>

<style scoped>

:slotted(*) {
    font-size: var(--fs-600);
}

</style>