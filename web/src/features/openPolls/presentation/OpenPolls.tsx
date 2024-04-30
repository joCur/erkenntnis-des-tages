import { DateFormat } from '@/common/components/date/DateFormat.tsx'
import { TABLE_NAME } from '@/common/constants/table-name.constants'
import { Poll } from '@/common/types/tables/polls/poll.type'
import { ROUTING_PATH } from '@/features/router/domain/constants/routing-path.constants'
import { supabase } from '@/supabase'
import { PieChartOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Tooltip, Typography } from 'antd'
import { getTime } from 'date-fns/fp/getTime'
import React from 'react'
import { generatePath, useNavigate } from 'react-router-dom'

export const OpenPolls: React.FC = () => {
  const [openPolls, setOpenPolls] = React.useState<Poll[]>([])
  const navigate = useNavigate()

  const getOpenPolls = React.useCallback(async () => {
    const { data, error } = await supabase.from(TABLE_NAME.polls).select().eq('is_closed', false)
    if (!data || error) {
      return
    }
    setOpenPolls((data as Poll[]).sort((a, b) => getTime(new Date(b.created_at)) - getTime(new Date(a.created_at))))
  }, [])

  React.useEffect(() => {
    getOpenPolls()
  }, [getOpenPolls])

  const handlePollClick = (pollId: string) => {
    navigate(generatePath(ROUTING_PATH.vote, { pollId }))
  }

  return (
    <Flex vertical align={'center'} gap={'large'}>
      <div
        style={{
          padding: 'var(--ant-padding) 0',
          width: '100%',
          position: 'sticky',
          top: '-24px',
          zIndex: 2,
          background: 'linear-gradient(180deg, var(--ant-color-bg-layout) 85%, transparent',
        }}
      >
        <Typography.Title>Offene Umfragen</Typography.Title>
      </div>
      <Flex wrap={'wrap'} justify={'center'} gap={'large'}>
        {openPolls.map((poll) => (
          <Card style={{ width: '300px', borderColor: poll.is_closed ? 'var(--ant-color-primary-active)' : 'inherit' }}>
            <Flex justify="space-between" align="center">
              <DateFormat date={new Date(poll.created_at)} />
              <Tooltip title="Abstimmen">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PieChartOutlined />}
                  onClick={() => handlePollClick(poll.id)}
                />
              </Tooltip>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Flex>
  )
}
