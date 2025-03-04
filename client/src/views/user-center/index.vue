<script setup lang="ts">
import { useAuthStore } from '@/store'
import { reactive, ref } from 'vue'
import { CheckmarkOutline, CloseOutline } from '@vicons/ionicons5'
import { updateUser} from '@/views/system/users/api'

type EditableFields = keyof typeof isEditing

const authStore = useAuthStore()
const { userInfo } = authStore

// 字段配置
const fields = [
	{ key: 'username', label: '用户名' },
	{ key: 'nickname', label: '昵称' },
	{ key: 'phone', label: '手机号' },
	{ key: 'email', label: '邮箱' },
	{ key: 'sex', label: '性别' },
	{ key: 'remark', label: '备注' }
]

// 编辑状态
const isEditing = reactive({
  avatar: false,
	username: false,
	nickname: false,
	phone: false,
	email: false,
	sex: false,
	remark: false
})

// 编辑值
const tempValue = reactive<Record<EditableFields, any>>({
	avatar: '',
	username: '',
	nickname: '',
	phone: '',
	email: '',
	sex: '',
	remark: ''
})

const avatarList = ref([])

// 开始编辑
const editField = (field: EditableFields) => {
  isEditing[field] = true
  tempValue[field] = userInfo[field]
}

// 保存修改
const saveField = async (field: EditableFields) => {
	userInfo[field] = tempValue[field]
	isEditing[field] = false

	try {
		const { success } = await updateUser({
			id: userInfo.id,
			[field]: tempValue[field]
		})
		$message.success('更新成功')
		await authStore.getUserInfo()
		if (!success) {
			return $message.error('更新失败')
		}

	} catch (err) {
		console.error(err)
	}
}

// 取消编辑
const cancelEdit = (field: EditableFields) => {
  isEditing[field] = false
  tempValue[field] = userInfo[field]
}

</script>

<template>
	<div class="p-4">
		<n-card title="个人信息" class=" mx-auto">
			<!-- 头像 -->
			<div class="flex items-center mb-6">
				<span class="w-100px">头像</span>
				<div class="flex-1 items-center justify-start">
					<n-avatar
						v-if="!isEditing.avatar"
						:src="userInfo.avatar"
						:size="64"
						class="mr-4"
					/>
					<template v-else>
						<n-upload
							v-model:file-list="avatarList"
							:max="1"
							list-type="image-card"
						>
							选择图片
						</n-upload>
					</template>
					<!-- <n-button
						v-if="!isEditing.avatar"
						text
						type="primary"
						@click="editField('avatar')"
					>
						修改
					</n-button> -->
					<template v-else>
						<n-button
							quaternary
							circle
							size="small"
							class="hover:text-primary-600 transition-colors"
							@click="saveField('avatar')"
						>
							<template #icon>
								<n-icon>
									<CheckmarkOutline />
								</n-icon>
							</template>
						</n-button>
						<n-button
							quaternary
							circle
							size="small"
							class="hover:text-error transition-colors"
							@click="cancelEdit('avatar')"
						>
							<template #icon>
								<n-icon>
									<CloseOutline />
								</n-icon>
							</template>
						</n-button>
					</template>
				</div>
			</div>

			<!-- 其他信息字段 -->
			<div v-for="field in fields" :key="field.key" class="flex items-center mb-4">
				<span class="w-100px">{{ field.label }}</span>
				<div class="flex-1">
					<template v-if="!isEditing[field.key as EditableFields]">
						<span class="mr-4">{{ userInfo[field.key] }}</span>
						<n-button
							v-if="userInfo[field.key] !== undefined && userInfo[field.key] !== null"
							text
							type="primary"
							@click="editField(field.key as EditableFields)"
						>
							修改
						</n-button>
					</template>
					<template v-else>
						<template v-if="field.key === 'sex'">
							<n-radio-group v-model:value="tempValue[field.key]">
								<n-radio-button value="male">男</n-radio-button>
								<n-radio-button value="female">女</n-radio-button>
							</n-radio-group>
						</template>
						<template v-else-if="field.key === 'remark'">
							<n-input
								v-model:value="tempValue[field.key]"
								type="textarea"
								:rows="3"
								class="w-300px mr-4"
							/>
						</template>
						<template v-else>
							<div class="w-50% flex items-center">
								<n-input
									v-model:value="tempValue[field.key as EditableFields]"
									class="w-200px mr-2"
								/>
								<n-button
									quaternary
									circle
									size="small"
									class="hover:text-primary-600 transition-colors"
									@click="saveField(field.key as EditableFields)"
								>
									<template #icon>
										<n-icon><CheckmarkOutline /></n-icon>
									</template>
								</n-button>
								<n-button
									quaternary
									circle
									size="small"
									class="hover:text-error transition-colors"
									@click="cancelEdit(field.key as EditableFields)"
								>
									<template #icon>
										<n-icon><CloseOutline /></n-icon>
									</template>
								</n-button>
							</div>
						</template>
					</template>
				</div>
			</div>
		</n-card>
	</div>
</template>

<style scoped></style>
