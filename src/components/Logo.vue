<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goHome() {
    router.push({
				name: 'main'
			})
}

</script>

<template>
    <div>
        <img src="/AllNetLogo.png" @click="goHome" style="cursor: pointer;">
    </div>
</template>

<style>
img {
    max-width: 100px;
    border-radius: 50%;
}
</style>