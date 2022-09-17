/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowClockwise } from "phosphor-react";

import {
    Accordion, Anchor, Box, Button, Container, Loader, Table, Text, Title
} from "@mantine/core";

import { useAllData } from "../hooks/useAllData";
import { formatDollars, shortenAddress } from "../lib/utils";

export default function NewHome() {
  const {
    tvl,
    topUsers,
    degenScores,
    topPositions,
    usersCount,
    loadData,
    loading,
    isShowingAllPositions,
    isShowingAllUsers,
  } = useAllData()

  return (
    <Box>
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '3rem' }}
      >
        <Title
          order={1}
          sx={() => ({
            fontSize: '3.5rem',
            '@media (max-width: 755px)': {
              fontSize: '2rem',
            },
          })}
          color="blue.8"
        >
          Orbit Whales
        </Title>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        {tvl && topUsers && (
          <Text size="xl" color="gray.7">
            TVL: <span style={{ fontWeight: '600' }}>{tvl} USD</span> | USERS:{' '}
            <span style={{ fontWeight: '600' }}>{usersCount}</span>
          </Text>
        )}
      </Box>

      {tvl && topUsers && topPositions && degenScores ? (
        <Container size="md" style={{ marginTop: '3rem', marginBottom: '5rem' }}>
          <Box
            sx={{
              width: 'full',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'end',
              paddingBottom: '1rem',
              gap: '1rem',
            }}
          >
            <Button variant="outline" color="blue" onClick={() => loadData({ resetAll: true })}>
              <ArrowClockwise size={22} />
            </Button>
          </Box>

          <Accordion variant="separated" defaultValue="top-users-tvl">
            <Accordion.Item value="top-users-tvl">
              <Accordion.Control>
                <Text size="lg" weight="bold" color="gray.7">
                  Users by TVL
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Table
                  verticalSpacing="sm"
                  horizontalSpacing="xs"
                  highlightOnHover
                  captionSide="bottom"
                >
                  <caption onClick={() => loadData({ llAllUsers: !isShowingAllUsers })}>
                    <Text size="sm" color="gray.7" style={{ cursor: 'pointer' }}>
                      {!loading
                        ? isShowingAllUsers
                          ? 'Show only top 10'
                          : 'Show more'
                        : 'Loading...'}
                    </Text>
                  </caption>

                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Address</th>
                      <th>TVL</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <Anchor
                            href={`https://polygonscan.com/address/${user.user}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {shortenAddress(user.user, 5)}
                          </Anchor>
                        </td>
                        <td>{formatDollars(user.totalValueLocked)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="top-users-degen">
              <Accordion.Control>
                <Text size="lg" weight="bold" color="gray.7">
                  Active Users by Degen Score
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Table verticalSpacing="sm" horizontalSpacing="xs" highlightOnHover>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Address</th>
                      <th>Degen Score</th>
                    </tr>
                  </thead>

                  <tbody>
                    {degenScores.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <Anchor
                            href={`https://polygonscan.com/address/${user.user}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {shortenAddress(user.user, 5)}
                          </Anchor>
                        </td>
                        <td>{user.totalDegen.toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="top-positions">
              <Accordion.Control>
                <Text size="lg" weight="bold" color="gray.7">
                  Positions by Value
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Table
                  verticalSpacing="sm"
                  horizontalSpacing="xs"
                  highlightOnHover
                  captionSide="bottom"
                >
                  <caption onClick={() => loadData({ showAllPositions: !isShowingAllPositions })}>
                    <Text size="sm" color="gray.7" style={{ cursor: 'pointer' }}>
                      {!loading
                        ? isShowingAllPositions
                          ? 'Show only top 10'
                          : 'Show more'
                        : 'Loading...'}
                    </Text>
                  </caption>

                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>NFT Id</th>
                      <th>Pool</th>
                      <th>Value</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topPositions.map((position, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <Anchor
                            href={`https://app.uniswap.org/#/pool/${position.id}?chain=polygon`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {position.id}
                          </Anchor>
                        </td>
                        <td>{position.poolName}</td>
                        <td>{formatDollars(position.marketValueUSD)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
          <Loader variant="dots" />
        </Box>
      )}
    </Box>
  )
}
