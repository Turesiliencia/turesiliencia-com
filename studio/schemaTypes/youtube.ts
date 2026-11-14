import {defineField, defineType} from 'sanity'

// A YouTube video inside a post, shown as an embedded player.
export const youtube = defineType({
  name: 'youtube',
  title: 'Vídeo de YouTube',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Enlace del vídeo',
      description: 'La dirección del vídeo en YouTube, por ejemplo https://www.youtube.com/watch?v=…',
      type: 'url',
      validation: (rule) =>
        rule.required().custom((url) =>
          !url || youtubeId(url) ? true : 'No es un enlace de YouTube que se pueda reconocer.',
        ),
    }),
    defineField({
      name: 'title',
      title: 'Título del vídeo',
      description: 'Lo anuncian los lectores de pantalla.',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'title', url: 'url'},
    prepare: ({title, url}) => ({title: title || 'Vídeo de YouTube', subtitle: url}),
  },
})

export function youtubeId(url: string): string | undefined {
  const match = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  )
  return match?.[1]
}
