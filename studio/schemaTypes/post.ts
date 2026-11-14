import {defineArrayMember, defineField, defineType} from 'sanity'

// A blog post. Its slug is its address on the site (turesiliencia.com/<slug>/),
// the same as on the old WordPress site, so links shared before keep working.
export const post = defineType({
  name: 'post',
  title: 'Entrada',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección',
      description:
        'La entrada se publica en turesiliencia.com/<dirección>/. Si la cambias después de publicarla, los enlaces que ya se hayan compartido dejarán de funcionar.',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumen',
      description:
        'Una o dos frases para el listado del blog, Google y las vistas previas al compartir el enlace. Si lo dejas vacío, se usa el comienzo del texto.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200).warning('Mejor en menos de 200 caracteres.'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen destacada',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          description: 'Qué muestra la imagen, para quien no puede verla.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Texto',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Párrafo', value: 'normal'},
            {title: 'Título', value: 'h2'},
            {title: 'Subtítulo', value: 'h3'},
            {title: 'Subtítulo menor', value: 'h4'},
            {title: 'Cita', value: 'blockquote'},
          ],
          lists: [
            {title: 'Viñetas', value: 'bullet'},
            {title: 'Numerada', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Negrita', value: 'strong'},
              {title: 'Cursiva', value: 'em'},
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'Enlace',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'Dirección',
                    type: 'url',
                    validation: (rule) =>
                      rule.uri({scheme: ['http', 'https', 'mailto'], allowRelative: true}),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          title: 'Imagen',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              description: 'Qué muestra la imagen, para quien no puede verla.',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Pie de foto',
              type: 'string',
            }),
          ],
        }),
        defineArrayMember({type: 'youtube'}),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Fecha de publicación, la más reciente primero',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt', media: 'coverImage'},
    prepare({title, date, media}) {
      return {
        title,
        subtitle: date
          ? new Date(date).toLocaleDateString('es-ES', {dateStyle: 'long'})
          : 'Sin fecha',
        media,
      }
    },
  },
})
