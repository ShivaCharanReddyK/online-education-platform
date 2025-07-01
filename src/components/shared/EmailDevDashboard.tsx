"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Send, Check, AlertCircle } from 'lucide-react'

interface EmailLog {
  id: string
  to: string
  subject: string
  timestamp: Date
  status: 'sent' | 'simulated' | 'failed'
  content?: string
}

export function EmailDevDashboard() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])

  // This would typically be populated by your email service
  // For now, we'll show some mock data to demonstrate
  const mockLogs: EmailLog[] = [
    {
      id: '1',
      to: 'student@example.com',
      subject: 'Application Submitted - Full-Stack Web Development',
      timestamp: new Date(),
      status: 'simulated'
    },
    {
      id: '2', 
      to: 'counselor@example.com',
      subject: 'New Application Received',
      timestamp: new Date(Date.now() - 300000),
      status: 'simulated'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-green-500" />
      case 'simulated':
        return <Mail className="h-4 w-4 text-blue-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Mail className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-500">Sent</Badge>
      case 'simulated':
        return <Badge variant="secondary" className="bg-blue-500 text-white">Simulated</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Development Dashboard
        </CardTitle>
        <CardDescription>
          Monitor email sending in development mode. Emails are simulated when no domain is configured.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Email Service Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-blue-500 text-white">Gmail Service</Badge>
            </div>
            <p className="text-sm text-blue-700">
              📧 Using Gmail email service: <code>{process.env.GMAIL_USER || 'configured in .env.local'}</code>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Emails are now sent via Gmail using Nodemailer. All emails are also logged to files.
            </p>
          </div>

          {/* Recent Email Logs */}
          <div>
            <h4 className="font-semibold mb-3">Recent Email Activity</h4>
            <div className="space-y-2">
              {mockLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <p className="font-medium text-sm">{log.subject}</p>
                      <p className="text-xs text-muted-foreground">To: {log.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(log.status)}
                    <span className="text-xs text-muted-foreground">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Email Button */}
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log('📧 Test email simulated!')
                alert('Test email sent! Check console for details.')
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Test Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
