import BlurPage from '@/components/global/blur-page'
import CircleProgress from '@/components/global/circle-progress'
import PipelineValue from '@/components/global/pipeline-value'
import SubaccountFunnelChart from '@/components/global/subaccount-funnel-chart'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { AreaChart, BadgeDelta } from '@tremor/react'
import { ClipboardIcon, Contact2, DollarSign, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
  params: { subaccountId: string }
  searchParams: {
    code: string
  }
}


const SubaccountPageId = async ({ params, searchParams }: Props) => {
  let currency = 'USD'
  let sessions
  let totalClosedSessions
  let totalPendingSessions
  let net = 0
  let potentialIncome = 0
  let closingRate = 0

  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: params.subaccountId,
    },
  })

  const currentYear = new Date().getFullYear()
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000

  if (!subaccountDetails) return

  if (subaccountDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: subaccountDetails.connectAccountId,
    })
    currency = response.default_currency?.toUpperCase() || 'USD'
    const checkoutSessions = await stripe.checkout.sessions.list(
      { created: { gte: startDate, lte: endDate }, limit: 100 },
      {
        stripeAccount: subaccountDetails.connectAccountId,
      }
    )
    sessions = checkoutSessions.data.map((session) => ({
      ...session,
      created: new Date(session.created).toLocaleDateString(),
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
    }))

    totalClosedSessions = checkoutSessions.data
      .filter((session) => session.status === 'complete')
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }))

    totalPendingSessions = checkoutSessions.data
      .filter(
        (session) => session.status === 'open' || session.status === 'expired'
      )
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }))

    net = +totalClosedSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2)

    potentialIncome = +totalPendingSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2)

    closingRate = +(
      (totalClosedSessions.length / checkoutSessions.data.length) *
      100
    ).toFixed(2)
  }

  const funnels = await db.funnel.findMany({
    where: {
      subAccountId: params.subaccountId,
    },
    include: {
      FunnelPages: true,
    },
  })

  const funnelPerformanceMetrics = funnels.map((funnel) => ({
    ...funnel,
    totalFunnelVisits: funnel.FunnelPages.reduce(
      (total, page) => total + page.visits,
      0
    ),
  }))

  return (
    <div>Subaccount Page Iddd</div>
  )
}

export default SubaccountPageId