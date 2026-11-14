import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'qnm95gjz',
    dataset: 'production'
  },
  // The hosted Studio's address: https://turesiliencia-com.sanity.studio
  studioHost: 'turesiliencia-com',
  deployment: {
    appId: 'gjdobn27v3kwssx0sgdyovl1',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
