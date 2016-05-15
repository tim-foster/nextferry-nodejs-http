#!/bin/bash

cd /home/ubuntu/ferry/schedules
/usr/bin/wget --header="Accept:text/xml" -O route_14.xml http://www.wsdot.wa.gov/ferries/api/schedule/rest/scheduletoday/14/true?apiaccesscode=45d2f914-dde8-4b2c-9c13-2d21f08c407c
