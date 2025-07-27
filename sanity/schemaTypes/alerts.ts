import { defineField, defineType } from 'sanity';

const alertTypeOptions = [
  { title: 'Price Target', value: 'price_target' },
  { title: 'Stop Loss', value: 'stop_loss' },
  { title: 'Status Change', value: 'status_change' },
  { title: 'New Signal', value: 'new_signal' },
];

export default defineType({
  name: 'alert',
  title: 'Signal Alert',
  type: 'document',
  fields: [
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      description: 'User who created this alert',
      validation: (Rule) => Rule.required().error('User reference is required'),
    }),
    defineField({
      name: 'signal',
      title: 'Signal',
      type: 'reference',
      to: [{ type: 'signal' }],
      description: 'Signal this alert is associated with',
      validation: (Rule) => Rule.required().error('Signal reference is required'),
    }),
    defineField({
      name: 'alertType',
      title: 'Alert Type',
      type: 'string',
      options: {
        list: alertTypeOptions,
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().error('Alert type is required'),
    }),
    defineField({
      name: 'triggerPrice',
      title: 'Trigger Price (USD)',
      type: 'number',
      description: 'Price at which the alert should trigger',
      hidden: ({ document }) => {
        const alertType = document?.alertType as string | undefined;
        return !(alertType === 'price_target' || alertType === 'stop_loss');
      },
      validation: (Rule) => 
        Rule.custom((field: unknown, context) => {
          const alertType = context.document?.alertType as string | undefined;
          if ((alertType === 'price_target' || alertType === 'stop_loss') && field === undefined) {
            return 'Trigger price is required for price target and stop loss alerts';
          }
          return true;
        }),
    }),
    defineField({
      name: 'isTriggered',
      title: 'Is Triggered?',
      type: 'boolean',
      initialValue: false,
      description: 'Whether the alert has been triggered',
      readOnly: true,
    }),
    defineField({
      name: 'isRead',
      title: 'Is Read?',
      type: 'boolean',
      initialValue: false,
      description: 'Whether the user has seen this alert',
    }),
    defineField({
      name: 'notificationSent',
      title: 'Notification Sent?',
      type: 'boolean',
      initialValue: false,
      description: 'Whether a notification for this alert has been sent',
      readOnly: true,
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      description: 'Additional data for this alert',
      fields: [
        defineField({
          name: 'targetIndex',
          title: 'Target Index',
          type: 'number',
          description: 'For price target alerts, which target this refers to (0-based index)',
          hidden: ({ parent }) => {
            const alertType = parent?.alertType as string | undefined;
            return !(alertType === 'price_target');
          },
        }),
        defineField({
          name: 'previousStatus',
          title: 'Previous Status',
          type: 'string',
          description: 'For status change alerts, the previous status',
          hidden: ({ parent }) => {
            const alertType = parent?.alertType as string | undefined;
            return !(alertType === 'status_change');
          },
        }),
        defineField({
          name: 'newStatus',
          title: 'New Status',
          type: 'string',
          description: 'For status change alerts, the new status',
          hidden: ({ parent }) => {
            const alertType = parent?.alertType as string | undefined;
            return !(alertType === 'status_change');
          },
        }),
      ],
    }),
    defineField({
      name: 'triggeredAt',
      title: 'Triggered At',
      type: 'datetime',
      description: 'When the alert was triggered',
      readOnly: true,
      hidden: ({ document }) => !document?.isTriggered,
    }),
  ],
  preview: {
    select: {
      user: 'user.name',
      signal: 'signal.name',
      alertType: 'alertType',
      triggerPrice: 'triggerPrice',
      isTriggered: 'isTriggered',
    },
    prepare(selection) {
      const { user, signal, alertType, triggerPrice, isTriggered } = selection;
      const title = `${user || 'User'}'s ${alertType || 'Alert'}`;
      const subtitle = [
        `Signal: ${signal || 'N/A'}`,
        triggerPrice && `at $${triggerPrice}`,
        isTriggered ? '(Triggered)' : '(Active)',
      ].filter(Boolean).join(' ');

      return {
        title,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [
        { field: '_createdAt', direction: 'desc' }
      ]
    },
    {
      title: 'Oldest First',
      name: 'createdAtAsc',
      by: [
        { field: '_createdAt', direction: 'asc' }
      ]
    },
  ],
  initialValue: () => ({
    isTriggered: false,
    isRead: false,
    notificationSent: false,
  })
});